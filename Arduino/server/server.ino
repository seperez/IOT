
#include <SPI.h>
#include <Mirf.h>
#include <nRF24L01.h>
#include <MirfHardwareSpiDriver.h>

//CONFIGURATION
char SERVER_ADDRES[7] = "SERVER";

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
  byte data[Mirf.payload];
  
  if(!Mirf.isSending() && Mirf.dataReady()){
    Mirf.getData(data);
    Serial.write(data, sizeof(data));
  }
}
