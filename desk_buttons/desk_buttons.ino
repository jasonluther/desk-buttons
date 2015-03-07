// Desk Buttons!
// Jason Luther <jason@ixid.net>

#define LED_RED 9
#define LED_GREEN 10
#define LED_BLUE 11
#define BUTTON_RED 12
#define LED_BUTTON_RED 13
#define BUTTON_SECRET 7
#define BUTTON_YELLOW 2
#define BUTTON_WHITE 4

#define BOUNCE_TIME 100

unsigned char led_rgb[3];
unsigned char led_button_red = 0;

#define NUM_BUTTONS 4
int button_pin[NUM_BUTTONS];
char *button_name[NUM_BUTTONS];
int button_last_value[NUM_BUTTONS];
long button_last_change_time[NUM_BUTTONS];
int button_send[NUM_BUTTONS];
#define SEND_NO -1

void setup() {
  Serial.begin(9600);
  while (Serial.available() > 0) { Serial.read(); }
  pinMode(LED_RED, OUTPUT);  
  pinMode(LED_GREEN, OUTPUT);  
  pinMode(LED_BLUE, OUTPUT);  
  pinMode(LED_BUTTON_RED, OUTPUT);
  
  int b = 0;
  button_pin[b] = BUTTON_RED;
  button_name[b] = "Big Red Button";
  b++;
  button_pin[b] = BUTTON_SECRET;
  button_name[b] = "Secret Button";
  b++;
  button_pin[b] = BUTTON_YELLOW;
  button_name[b] = "Yellow Button";
  b++;
  button_pin[b] = BUTTON_WHITE;
  button_name[b] = "White Button";
  b++;
    
  for (int i = 0; i < NUM_BUTTONS; i++) {
    pinMode(button_pin[i], INPUT_PULLUP);
    button_send[i] = false;
    button_last_value[i] = digitalRead(i);
    button_last_change_time[i] = 0;
  }

}

void loop() {
  digitalWrite(LED_RED, HIGH);
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_BLUE, HIGH);
  digitalWrite(LED_BUTTON_RED, HIGH);

  for (int i = 0; i < NUM_BUTTONS; i++) {
    int value = digitalRead(button_pin[i]); 
    int last_value = button_last_value[i];
    button_last_value[i] = value;
    if (last_value != value) {
       long now = millis();
       if (now - button_last_change_time[i] > BOUNCE_TIME) {
         button_last_change_time[i] = now;
         button_send[i] = value; 
       }
    }
  }

  for (int i = 0; i < NUM_BUTTONS; i++) {
    if (button_send[i] != SEND_NO) {
      Serial.print(button_name[i]); Serial.print(": "); Serial.println(button_send[i]);
      button_send[i] = SEND_NO;
    }
  }

  delay(10);
}
