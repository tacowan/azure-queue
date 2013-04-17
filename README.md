Azure Queue listener example
===============================
To use this example, require azure-queue, instantiate a queue listener,
provide it with a callback for the "message" event, and finally
attach the listener to a particular queue.

```javascript
var QueueListener = require('azure-queue');
var azure = require('azure');
var queuename = "myqueue";

var queueService = azure.createQueueService();

var listener = new QueueListener();
listener.on('message', function(message) {
	// watch the backoff/speedup 
	console.log("..." + Math.pow(2, listener.timeout));

	// at a minumum the message should be deleted 
    // otherwise it'll remain on the queue
    // add message processing here
	queueService.deleteMessage(queuename
                , message.messageid
                , message.popreceipt
                , function(error){
                    if(!error){
                        console.log("deleted");
                    }
                });
});
listener.listen(queuename, queueService);
```