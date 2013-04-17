var EventEmitter = require('events').EventEmitter;
var util = require('util');

exports = module.exports = QueueListener;

function QueueListener(m) {
	this.messages = 1;
	this.timeout = 1;
	if (m)
		this.messages = m;
}

util.inherits(QueueListener, EventEmitter);
QueueListener.prototype.listen = function(queueName, queueService) {
	var self = this;
	var interval;
	queueService.createQueueIfNotExists(queueName, function(error) {
		if(!error) {
			self.emit('newqueue');
			interval = setInterval(msgs, Math.pow(2,self.timeout));
		} else {
			console.log(error.message)
		}
	});

	var reset = function() {
		clearInterval(interval);
		interval = setInterval(msgs, Math.pow(2,self.timeout));
	}

	var msgs = function() {
		queueService.getMessages(queueName, {numofmessages: self.messages}, function(error, messages) {
			if(!error) {					
				for(var index in messages)
					self.emit('message', messages[index]);
				if (messages.length > 0 && self.timeout > 0) {
					self.timeout--;
					reset();
				} else if (messages.length < 1 && self.timeout < 10) {
					self.timeout++;
					reset();
				}
			} else {
				console.log(error.message);
			}			
		});
	}
}