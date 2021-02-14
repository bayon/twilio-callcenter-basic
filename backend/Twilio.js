const twilio = require('twilio');
const VoiceResponse = require('twilio/lib/twiml/VoiceResponse');

class Twilio {

  phoneNumber = "+1 520 317 7189"; // +15203177189
  phoneNumberSid = "PN42a5121daa3089b88b5de4a31b7cf856"; // twilio: from Active Numbers
  tokenSid = "SK09e3c00431cd972701b87bd43a2e56e7"; // twilio: SID  from new API KEY
  tokenSecret = "eFZ7auvoPcykFVY76ZUyPqYYsVnYy7nz"; // twilio: SECRET from new API KEY
  accountSid = "AC1597dab72a1abfaeaf2ecc3b81ef800e"; // twilio: from dashboard
  verify = "VA93afb25e90d948b9dbc70ace18b86c89"; // twilio: SERVICE SID from verify> create new service
  outgoingApplicationSid = "AP56e3ce289fbac81ece043541048f6687"; //twilio: from Twiml App

  localTunnelUrl = "https://forte-calls.loca.lt";
    
  client;
  constructor() {
    this.client = twilio(this.tokenSid, this.tokenSecret, {
      accountSid: this.accountSid,
    });
  }
  getTwilio() {
    this.client;
  }

  async sendVerifyAsync(to, channel) {
    const data = await this.client.verify
      .services(this.verify)
      .verifications.create({
        to,
        channel,
      });
    console.log('sendVerify');
    return data;
  }

  async verifyCodeAsync(to, code) {
    const data = await this.client.verify
      .services(this.verify)
      .verificationChecks.create({
        to,
        code,
      });
    console.log('verifyCode');
    return data;
  }

  voiceResponse(message) {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: 'female',
      },
      message
    );
    twiml.redirect(this.localTunnelUrl+'/enqueue');
    return twiml;
  }

  enqueueCall(queueName) {
    const twiml = new VoiceResponse();
    twiml.enqueue(queueName);
    return twiml;
  }

  redirectCall(client) {
    const twiml = new VoiceResponse();
    twiml.dial().client(client);
    return twiml;
  }

  answerCall(sid) {
    console.log('answerCall with sid', sid);
    this.client.calls(sid).update({
      url: this.localTunnelUrl + '/connect-call',
      method: 'POST',
      function(err, call) {
        console.log('anwserCall', call);
        if (err) {
          console.error('anwserCall', err);
        }
      },
    });
  }

  getAccessTokenForVoice = (identity) => {
    console.log(`Access token for ${identity}`);
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    const outgoingAppSid = this.outgoingApplicationSid;
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: outgoingAppSid,
      incomingAllow: true,
    });
    const token = new AccessToken(
      this.accountSid,
      this.tokenSid,
      this.tokenSecret,
      { identity }
    );
    token.addGrant(voiceGrant);
    console.log('Access granted with JWT', token.toJwt());
    return token.toJwt();
  };
}

const instance = new Twilio();
Object.freeze(instance);

module.exports = instance;
