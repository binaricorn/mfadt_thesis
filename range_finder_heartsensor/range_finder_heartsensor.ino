
/*
>> Pulse Sensor Amped 1.2 <<
This code is for Pulse Sensor Amped by Joel Murphy and Yury Gitman
    www.pulsesensor.com 
    >>> Pulse Sensor purple wire goes to Analog Pin 0 <<<
Pulse Sensor sample aquisition and processing happens in the background via Timer 2 interrupt. 2mS sample rate.
PWM on pins 3 and 11 will not work when using this code, because we are using Timer 2!
The following variables are automatically updated:
Signal :    int that holds the analog signal data straight from the sensor. updated every 2mS.
IBI  :      int that holds the time interval between beats. 2mS resolution.
BPM  :      int that holds the heart rate value, derived every beat, from averaging previous 10 IBI values.
QS  :       boolean that is made true whenever Pulse is found and BPM is updated. User must reset.
Pulse :     boolean that is true when a heartbeat is sensed then false in time with pin13 LED going out.

This code is designed with output serial data to Processing sketch "PulseSensorAmped_Processing-xx"
The Processing sketch is a simple data visualizer. 
All the work to find the heartbeat and determine the heartrate happens in the code below.
Pin 13 LED will blink with heartbeat.
If you want to use pin 13 for something else, adjust the interrupt handler
It will also fade an LED on pin fadePin with every beat. Put an LED and series resistor from fadePin to GND.
Check here for detailed code walkthrough:
http://pulsesensor.myshopify.com/pages/pulse-sensor-amped-arduino-v1dot1

Code Version 1.2 by Joel Murphy & Yury Gitman  Spring 2013
This update fixes the firstBeat and secondBeat flag usage so that realistic BPM is reported.

*/


//  VARIABLES
int pulsePin = 0;                 // Pulse Sensor purple wire connected to analog pin 0
int blinkPin = 13;                // pin to blink led at each beat
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
int ledPin = 4;

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
  
  interruptSetup();                 // sets up to read Pulse Sensor signal every 2mS 
   // UN-COMMENT THE NEXT LINE IF YOU ARE POWERING The Pulse Sensor AT LOW VOLTAGE, 
   // AND APPLY THAT VOLTAGE TO THE A-REF PIN
   //analogReference(EXTERNAL);   
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
    waitingForUser();
  }
 
  else if (distance <= maximumRange) {
    haveUser();
  }
  
  delay(250);                             //  take a break
}

void waitingForUser() {
  lostUser++;
  //if longer than count of ten
  if(lostUser >= 10) {
    nobody();
  }

}

void nobody() {
    Serial.println("0");
    lostUser = 0;
}

void haveUser() {
    foot1SensorVal = analogRead(footSensor1);
    foot2SensorVal = analogRead(footSensor2);
    int handButton1Val = digitalRead(handButton1); 
    int handButton2Val = digitalRead(handButton2); 
 
    if(handButton1Val == 1 && handButton2Val == 1) {
      digitalWrite(ledPin, HIGH);
    } else {
      digitalWrite(ledPin, LOW);
    }
    
    if(foot1SensorVal > 900 && foot2SensorVal > 900) {
      digitalWrite(ledPin, HIGH);
    } else {
      digitalWrite(ledPin, LOW);
    }
    
    Serial.print("1");
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





