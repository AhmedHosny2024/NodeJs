const express = require('express');
const morgan = require('morgan');
const fs = require('fs');


const app = express();

// 1) Middleware (middle between request and response)
app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({ message: 'Hello from the server side!', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// 2) all route handeler functions

// Tours
const getAllTours = (req, res) => {
    res
        .status(200)
        .json({
            status: 'success',
            results: tours.length,
            data: { tours }
        });
}
const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res
            .status(201)
            .json({
                status: 'success',
                data: { tour: newTour }
            });
    });
}
const getTour = (req, res) => {
    const id = req.params.id * 1;   // convert string to number
    const tour = tours.find(el => el.id === id);
    if (!tour) {
        return res
            .status(404)
            .json({
                status: 'fail',
                message: 'Invalid ID'
            });
    }
    res
        .status(200)
        .json({
            status: 'success',
            data: { tour },
        });
}
const updateTour = (req, res) => {
    const id = req.params.id * 1;   // convert string to number
    const tour = tours.find(el => el.id === id);
    if (!tour) {
        return res
            .status(404)
            .json({ status: 'fail', message: 'Invalid ID' });
    }
    res
        .status(200)
        .json({
            status: 'success',
            data: { tour: '<Updated tour here...>' }
        });
}
const deleteTour = (req, res) => {
    const id = req.params.id * 1;   // convert string to number
    const tour = tours.find(el => el.id === id);
    if (!tour) {
        return res
            .status(404)
            .json({ status: 'fail', message: 'Invalid ID' });
    }
    res
        .status(204)
        .json({
            status: 'success',
            data: null
        });
}
// Users
const GetAllUsers = (req, res) => {
    res
        .status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined'
        });
}
const CreateUser = (req, res) => {
    res
        .status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined'
        });
}
const GetUser = (req, res) => {
    res
        .status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined'
        });
}
const UpdateUser = (req, res) => {
    res
        .status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined'
        });
}
const DeleteUser = (req, res) => {
    res
        .status(500)
        .json({
            status: 'error',
            message: 'This route is not yet defined'
        });
}

// app.get('/api/v1/tour', getAllTours);
// app.post('/api/v1/tour', createTour);
// app.get('/api/v1/tour/:id', getTour);
// app.patch('/api/v1/tour/:id', updateTour);
// app.delete('/api/v1/tour/:id', deleteTour);

// 3) Routes
app.route('/api/v1/tour')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tour/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

app.route('/api/v1/users')
    .get(GetAllUsers)
    .post(CreateUser);

app.route('/api/v1/users/:id')
    .get(GetUser)
    .patch(UpdateUser)
    .delete(DeleteUser);

// 4) Start server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});