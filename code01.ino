#include "SHT1x.h"

#define dataPin  D4
#define clockPin D5
SHT1x sht1x(dataPin, clockPin);

int led = D7;
int button = D1;
int valve = D0;

unsigned long wait = millis();
const unsigned long waittime = 5000L;

double temp;
double humidity;

void setup() {
  pinMode(led, OUTPUT);
  pinMode(button, INPUT);
  pinMode(valve, OUTPUT);

  Serial.begin(9600); // Open serial connection to report values to host
  Serial.println("Starting up");

  Spark.variable("temp", &temp, DOUBLE);
  Spark.variable("humidity", &humidity, DOUBLE);
}

void loop() {
  if(digitalRead(button) == HIGH) {
    digitalWrite(led, HIGH);
    digitalWrite(valve, HIGH);
  } else {
    digitalWrite(led, LOW);
    digitalWrite(valve, LOW);
  }

  if (millis() > wait) {
    wait = millis() + waittime;

    // Read values from the sensor
    temp = sht1x.readTemperatureC();
    humidity = sht1x.readHumidity();

    // Print the values to the serial port
    Serial.print("Temperature: ");
    Serial.print(temp, DEC);
    Serial.print("°C ");
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println("%");
  }
}
