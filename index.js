'use strict';

const {PubSub} = require('@google-cloud/pubsub');
const pubsub = new PubSub();
const url = require('url');


// Publish to Pub/Sub.
exports.publish = async (req, res) => {

  if( 'POST' !== req.method ) {
      res.status(403).send('Forbidden!');
  }

  if( ! req.query && ! req.query.topic ){
    return res.status( 420 ).send( "Missing required \'topic\' parameter." );
  }

  if( req.query.apikey !== String( process.env.APIKEY ) ){
    return res.status( 420 ).send( "Required API Key is missing or invalid." );
  }

  console.log( "Publishing to Pub/Sub Topic: " + req.query.topic );

  // Set Topic.
  const topic = pubsub.topic( req.query.topic );

  const messageObject = {
    data: {
      message: req.body,
    },
  };
  const messageBuffer = Buffer.from(JSON.stringify(messageObject), 'utf8');
  
  console.log( JSON.stringify( req.body ) );

  // Publish the message.
  try {
    await topic.publish(messageBuffer);
    res.status(200).send({ "status" : "success", 'topic' : req.query.topic, "message" : req.body });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
    return Promise.reject(err);
  }
};


