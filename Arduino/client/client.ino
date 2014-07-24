#include <LiquidCrystal.h>
#include <SPI.h>
#include <Mirf.h>
#include <nRF24L01.h>
#include <MirfHardwareSpiDriver.h>
#include <string>

LiquidCrystal TFTScreen(9, 6, 5, 4, 3, 2);

//CONFIGURATION
int TEMP_SENSOR_ANALOG_PIN = 0; //ARDUINO ANALOG PIN
char DEVICE_ADDRES[7] = "CLI01";
char SERVER_ADDRES[7] = "SERVER";
char DEVICE[15] = "001"; //DEVICE NUMBER

//INTERNAL VARIABLES
char SEPARATOR[2] = "|";
char END_OF_PACKET[2] = "#";

float prevC = 150,
      toleranceC = 0.5;

void setup(){
  Serial.begin(9600);

  TFTScreen.begin(16, 2);
  TFTScreen.print("Temperatura:");
  
  Mirf.spi = &MirfHardwareSpi;
  Mirf.init();
  Mirf.setRADDR((byte *)DEVICE_ADDRES);
  Mirf.payload = 13;
  
  Mirf.channel = 90;
  Mirf.config();
  Mirf.configRegister(RF_SETUP,0x06); // 1MHz
  
  Serial.println("Iniciando..."); 
}

void transmit(char *string){
  /*
  byte c;
  
  for(int i =0; string[i]!=0x00;i++){
    c= string[i];
    Mirf.send(&c);
    while(Mirf.isSending()){}
  }
  */
  
  //envia el mensage entero
  Mirf.send((uint8_t*) string);
  
} 

char* createPacket(char* code, char* value){
    char charPacket [100];  
    String packet = "";
    packet = DEVICE;
    packet = packet + SEPARATOR;
    packet = packet + code;
    packet = packet + SEPARATOR;
    packet = packet + value;
    packet = packet + "#";
    strcpy(charPacket, packet.c_str());
    Serial.println(charPacket);
    return charPacket;
};

void loop() {
  delay(2000);
  
  char buffer[50];
  char* charPacket;
  boolean isShowC = false;
  
  Mirf.setTADDR((byte *)SERVER_ADDRES);
  
  float c = (5.0 * analogRead(TEMP_SENSOR_ANALOG_PIN) * 100.0) / 1024;
  if(!isnan(c) && (c > (prevC + toleranceC) || c < (prevC - toleranceC))){
    prevC = c;
    
    TFTScreen.setCursor(0,1);
    TFTScreen.print(c);
    TFTScreen.setCursor(6,1);
    TFTScreen.print("C");
    
    charPacket = createPacket("01", dtostrf(c, 5, 2, buffer));   
    transmit(charPacket);
  } 
}


