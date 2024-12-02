#include <DHT.h>
#include <PubSubClient.h>
#include <WiFi.h>

#define DHTTYPE DHT11
#define DHTPIN 15
#define RELAY1_PIN 2
#define RELAY2_PIN 4
#define RELAY3_PIN 5
#define RELAY4_PIN 18

// Configurações de WiFi
const char* ssid = "ZAIA"; // Substitua pelo nome da sua rede
const char* password = "zaiazaia"; // Substitua pela senha da sua rede

// Configurações do MQTT
const char* mqtt_server = "192.168.0.240"; // Substitua pelo IP do seu broker MQTT
const int mqtt_port = 1883; // Porta padrão do MQTT

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

char msg[200];

// Função para conectar ao WiFi
void setup_wifi() {
  delay(10);
  Serial.begin(115200);
  Serial.println();
  Serial.print("Conectando-se a ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  // Espera até que a conexão seja estabelecida
  while (WiFi.status() != WL_CONNECTED) {
    delay(5000);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.println("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

// Função de callback para mensagens recebidas (opcional)
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Mensagem recebida [");
  Serial.print(topic);
  Serial.print("]: ");
  for (unsigned int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Lógica para acionar os relés com base na mensagem recebida
  if (strcmp(topic, "acionar/reles") == 0) {
    if (payload[0] == '1') {
      digitalWrite(RELAY1_PIN, HIGH);
    } else {
      digitalWrite(RELAY1_PIN, LOW);
    }
    if (payload[1] == '1') {
      digitalWrite(RELAY2_PIN, HIGH);
    } else {
      digitalWrite(RELAY2_PIN, LOW);
    }
    if (payload[2] == '1') {
      digitalWrite(RELAY3_PIN, HIGH);
    } else {
      digitalWrite(RELAY3_PIN, LOW);
    }
    if (payload[3] == '1') {
      digitalWrite(RELAY4_PIN, HIGH);
    } else {
      digitalWrite(RELAY4_PIN, LOW);
    }
  }
}

// Função para reconectar ao broker MQTT
void reconnect() {
  // Loop até que esteja reconectado
  while (!client.connected()) {
    Serial.print("Tentando conexão MQTT...");
    // Tente se conectar
    if (client.connect("trabalho_trans")) { 
      Serial.println("conectado");
      // Subscreva em tópicos, se necessário
      client.subscribe("acionar/reles");
    } else {
      Serial.print("falhou, rc=");
      Serial.print(client.state());
      Serial.println(" tentando novamente em 5 segundos");
      delay(5000);
    }
  }
}

void setup() {
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  dht.begin();

  // Configuração dos pinos dos relés
  pinMode(RELAY1_PIN, OUTPUT);
  pinMode(RELAY2_PIN, OUTPUT);
  pinMode(RELAY3_PIN, OUTPUT);
  pinMode(RELAY4_PIN, OUTPUT);

  // Inicializa os relés em estado desligado
  digitalWrite(RELAY1_PIN, LOW);
  digitalWrite(RELAY2_PIN, LOW);
  digitalWrite(RELAY3_PIN, LOW);
  digitalWrite(RELAY4_PIN, LOW);
}

void loop() {
  // Reconnect MQTT se necessário
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Leitura dos dados reais do sensor DHT
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Falha ao ler do sensor DHT!");
    return;
  }

  // Crie o JSON com os dados
  snprintf(msg, sizeof(msg), "{\"temperature\":%.2f,\"humidity\":%.2f}", temperature, humidity);

  // Publique os dados
  Serial.print("Publicando: ");
  Serial.println(msg);
  client.publish("trabalho_trans", msg);

  // Aguarde 10 segundos antes da próxima leitura
  delay(10000);
}