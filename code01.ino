int led = D7;
int button = D1;
int valve = D0;


void setup() {
  pinMode(led, OUTPUT);
  pinMode(button, INPUT);
  pinMode(valve, OUTPUT);
}

void loop() {
  if(digitalRead(button) == HIGH) {
    digitalWrite(led, HIGH);
    digitalWrite(valve, HIGH);
  } else {
    digitalWrite(led, LOW);
    digitalWrite(valve, LOW);
  }
}
