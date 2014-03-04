#define echoPin 7 // Echo Pin
#define trigPin 8 // Trigger Pin

int maximumRange = 200; // Maximum range needed
int minimumRange = 0; // Minimum range needed
long duration, distance; // Duration used to calculate distance

int pressureSensor = A0;
int val;

int lostUser = 0;


void setup() {
  // put your setup code here, to run once:
  Serial.begin (9600);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(pressureSensor, INPUT);
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
    Serial.print("0");
    Serial.println(",");
    lostUser = 0;
}

void haveUser() {
    Serial.print("1");
    Serial.print(",");
    val = analogRead(pressureSensor);
    Serial.println(val);
    lostUser = 0;
}
