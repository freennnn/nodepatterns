import { EventEmitter } from 'events';
function ticker(number, callback) {
  const eventEmitter = new EventEmitter();
  let timeElapsed = 0;
  let ticksEmitted = 0;

  function tick() {
    timeElapsed += 50;
    if (timeElapsed < number) {
      eventEmitter.emit('tick', ++ticksEmitted);
      setTimeout(tick, 50);
    } else {
      callback(null, ticksEmitted);
    }
  }
  setTimeout(tick, 50);
  return eventEmitter;
}

ticker(301, (err, count) => console.log(`ticks been emitted ${count}`))
  .on('tick', (index) => console.log(`ticked ${index}`)) 