
#include <SPI.h>
#include <Mirf.h>
#include <nRF24L01.h>
#include <MirfHardwareSpiDriver.h>


//CONFIGURATION
char SERVER_ADDRES[7] = "SERVER";

//INTERNAL VARIABLES
char SEPARATOR[2] = "|";
char END_OF_PACKET[2] = "#";

int serialData = 0; 
String serialWord;

void transmit(char *string){
  Serial.println(string);
  Mirf.send((uint8_t*) string);
} 

char* createPacket(char* code, String value){
    char charPacket [100];  
    String packet = "";
    packet = code;
    packet = packet + value;
    strcpy(charPacket, packet.c_str());
    Serial.println(charPacket);
    return charPacket;
 };

void setup(){
  Serial.begin(9600);

  Mirf.spi = &MirfHardwareSpi;
  Mirf.init();
  Mirf.setRADDR((byte *)SERVER_ADDRES);
  Mirf.payload = 13;
  Mirf.channel = 90;
  Mirf.config();
  Mirf.configRegister(RF_SETUP,0x06); // 1MHz
}

void loop(){
  char* charPacket;
  byte data[Mirf.payload];
  
  if(!Mirf.isSending() && Mirf.dataReady()){
    Mirf.getData(data);
    Serial.write(data, sizeof(data));
  }
  

  if (Serial.available() > 0) {
    serialData = Serial.read();
    if(serialData != 35){
      serialWord = serialWord + (char) serialData;
    }else{
      Serial.print(serialWord);
      charPacket = createPacket("01", serialWord);   
      Mirf.payload = 20;
      Mirf.setTADDR((byte *)"D0001");
      transmit(charPacket);
      serialWord = "";
    }
  }
}
