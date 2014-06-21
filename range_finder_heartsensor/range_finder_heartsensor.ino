//  VARIABLES
int pulsePin = 0;                 // Pulse Sensor purple wire connected to analog pin 0
//int ledStrip = 4;                 // Fade LED strip when feet are on the board
#define echoPin 7                 // Echo Pin
#define trigPin 8                 // Trigger Pin

int maximumRange = 120; // Maximum range needed
int minimumRange = 0; // Minimum range needed
long duration, distance; // Duration used to calculate distance

int footSensor1 = A2;
int footSensor2 = A3;    
int handButton1 = 2;
int handButton2 = 3;
int ledPin = 9;

int foot1SensorVal;
int foot2SensorVal;

int lostUser = 0;

// these variables are volatile because they are used during the interrupt service routine!
volatile int BPM;                   // used to hold the pulse rate
volatile int Signal;                // holds the incoming raw data
volatile int IBI = 600;             // holds the time between beats, must be seeded! 
volatile boolean Pulse = false;     // true when pulse wave is high, false when it's low
volatile boolean QS = false;        // becomes true when Arduoino finds a beat.


void setup(){
  Serial.begin(115200);             // we agree to talk fast!
  
  pinMode(ledPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(footSensor1, INPUT);
  pinMode(footSensor2, INPUT);
  
  interruptSetup();                 
}

void loop(){
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(2); 

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10); 
 
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);
  //Calculate the distance (in cm) based on the speed of sound.
  distance = duration/58.2;
  
  if (distance >= maximumRange || distance <= minimumRange){
    sendingData(0);
  }
  else if (distance <= maximumRange) {
    sendingData(1);

  }
  
  delay(250);                             //  take a break
}

int sendingData(int presence) {
  foot1SensorVal = analogRead(footSensor1);
  foot2SensorVal = analogRead(footSensor2);
  int handButton1Val = digitalRead(handButton1); 
  int handButton2Val = digitalRead(handButton2); 
  
    Serial.print(presence);  
    Serial.print(",");
    Serial.print(foot1SensorVal);
    Serial.print(",");
    Serial.print(foot2SensorVal);
    Serial.print(",");
    Serial.print(handButton1Val);
    Serial.print(",");
    Serial.print(handButton2Val);
      
   if (QS == true){                       // Quantified Self flag is true when arduino finds a heartbeate
        sendDataToProcessing('B',BPM);   // send heart rate with a 'B' prefix
        QS = false;                      // reset the Quantified Self flag for next time    
     } else {
      Serial.println(","); // Else..whatever.
     }
     
    lostUser = 0;   
}


void sendDataToProcessing(char symbol, int data ){
    Serial.print(",");
    Serial.print(symbol);                // symbol prefix tells Processing what type of data is coming
    Serial.println(data);                // the data to send culminating in a carriage return
  }

