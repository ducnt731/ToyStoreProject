//import modules
const { request, response } = require('express');
const express = require ('express');
//open server at port 3333
const app = express();
app.listen(3333,() => {
    console.log('Server is listening on port 3333');
});
// api test
app.get('/test', (request,response) => {
    response.status(200).json("hello");
});
const mongoose = require ('mongoose');
//trying connect to mongodb
mongoose.connect('mongodb+srv://admin123:123456Abcd@cluster0.s5vt4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
   { useNewUrlParser: true }, (err) => {
       if (err) {
           console.log('Can not connect to mongodb, because ' + err);
       } else {
           console.log('Connect to mongodb successful');
       }
   });
//define task schema
const taskSchema = mongoose.Schema({
    content: {type: String},
    status: {type: Boolean}
});
const Task = mongoose.model('Task', taskSchema);
app.use(bodyParser.json());
//api add new task
app.post('/task', (request,response) => {
    const  newTask = new Task({
        content: request.body.content,
        status: false
    });
    newTask.save(err => {
        if(err){
            response.status(400).json({message: 'Cant add new task'});
            console.log('Cant add new task because + err');
        } else {
            response.status(200).json({message: 'Add new task successful'});
        }
    });
});
//api get list task
app.get('/task', (request, response) => {
    Task.find((err, res) => {
        if (err) {
            response.status(400).json({message: 'Cant take the data'});
            console.log('Error when getting data' + err);
        } else {
            response.status(200).json(res);
        }
    });
});
//api update a task
app.put('/task', async (request, response) => {
    // find a task by id
    const task = await Task.findById(request.body.id);
    //check if result is null
    if (!task) {
        response.status(400).json({message: 'Cant find data with id' + request.body.id});
        return;
    }
    //else, continue update
    task.updateOne({ id: request.body.id, status: !task.status}, (err, raw) => {
        if (err) {
            response.status(400).json({message: 'Cant update task'});
            console.log('Error when updating data' + err);
        } else {
            response.status(200).json({message: 'Update task successful'});
        }
    });
});
//api delete a task
app.delete('/task', async (request, response) => {
    Task.deleteOne({_id: request.body.id}, (err) => {
        if (err) {
            response.status(400).json({message: 'Cant delete task'});
            console.log('Error when deleting data' + err);
        } else {
            response.status(200).json({message: 'Delete task successful'});
        }
    });
});
