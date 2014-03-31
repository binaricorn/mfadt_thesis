#define echoPin 7 // Echo Pin
#define trigPin 8 // Trigger Pin

int maximumRange = 120; // Maximum range needed
int minimumRange = 0; // Minimum range needed
long duration, distance; // Duration used to calculate distance

int sitSensor = A0;
int footSensor1 = A2;
int footSensor2 = A3;    
int handButton1 = 2;
int handButton2 = 3;
int ledPin = 13;

int sitVal;
int foot1SensorVal;
int foot2SensorVal;

int lostUser = 0;


void setup() {
  // put your setup code here, to run once:
  Serial.begin (9600);
  pinMode(ledPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(sitSensor, INPUT);
  pinMode(footSensor1, INPUT);
  pinMode(footSensor2, INPUT);
}

void loop() {
/* The following trigPin/echoPin cycle is used to determine the
 distance of the nearest object by bouncing soundwaves off of it. */
 
 digitalWrite(trigPin, LOW); 
 delayMicroseconds(2); 

 digitalWrite(trigPin, HIGH);
 delayMicroseconds(10); 
 
 digitalWrite(trigPin, LOW);
 duration = pulseIn(echoPin, HIGH);
 
 
 //Calculate the distance (in cm) based on the speed of sound.
 distance = duration/58.2;
 
 if (distance >= maximumRange || distance <= minimumRange){
   waitingForUser();
 }
 else if (distance <= maximumRange) {
   haveUser();
 }
 
 
 delay(500);
}

void waitingForUser() {
  lostUser++;
  //if longer than count of ten
  if(lostUser >= 10) {
    nobody();
  }

}

void nobody() {
    sitVal = analogRead(sitSensor);
    Serial.print("0");
    Serial.print(",");

    Serial.println(sitVal);
    lostUser = 0;
}

void haveUser() {
    sitVal = analogRead(sitSensor);
    foot1SensorVal = analogRead(footSensor1);
    foot2SensorVal = analogRead(footSensor2);
    int handButton1Val = digitalRead(handButton1); 
    int handButton2Val = digitalRead(handButton2); 
 
    if(handButton1Val == 1 && handButton2Val == 1) {
      digitalWrite(ledPin, HIGH);
    } else {
      digitalWrite(ledPin, LOW);
    }
    
    Serial.print("1");
    Serial.print(",");
    Serial.print(sitVal);
    Serial.print(",");
    Serial.print(foot1SensorVal);
    Serial.print(",");
    Serial.print(foot2SensorVal);
    Serial.print(",");
    Serial.print(handButton1Val);
    Serial.print(",");
    Serial.println(handButton2Val);
    lostUser = 0;
}
