const cluster = require('cluster');
const os = require('os');
const app = require('app.js');

if(cluster.isMaster){
    // If master create number of worker process equal to the number of core of the system
    let numWorker = os.cpus().length();
    console.log(numWorker); 
    for(let i=0;i<numCpu;i++){
        cluster.fork();
    }

    // Log when the worker is successfully started
    cluster.on("online", (worker) => {
        console.log("Worker "+worker.process.pid+" is online");
    });

    // If a worker exit then log it and fork a new worker
    cluster.on("exit", (worker, code, signal) => {
        console.log('Worker '+worker.process.pid+" died with code: "+code+" and signal : "+signal);
        console.log('Starting a new worker');
        cluster.fork();
    })
} else{
    // If not master then start the express server 
    app.listen(8080, () => {
        console.log('Process '+process.id+" is listening to all incoming request");
    });
}