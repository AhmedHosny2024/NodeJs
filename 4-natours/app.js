const express = require('express');
const fs = require('fs');
const { get } = require('http');

const app = express();

// Middleware (middle between request and response)
app.use(express.json());

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({ message: 'Hello from the server side!', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...');
// });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

// all route handeler functions
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
            .json({ status: 'fail', message: 'Invalid ID' });
    }
    res
        .status(200)
        .json({
            status: 'success',
            data: { tour }
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

// app.get('/api/v1/tour', getAllTours);
// app.post('/api/v1/tour', createTour);
// app.get('/api/v1/tour/:id', getTour);
// app.patch('/api/v1/tour/:id', updateTour);
// app.delete('/api/v1/tour/:id', deleteTour);

app.route('/api/v1/tour')
    .get(getAllTours)
    .post(createTour);

app.route('/api/v1/tour/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});