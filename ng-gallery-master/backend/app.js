const express = require('express');
const app = express();

const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const gm = require('gm');
const fs = require('fs');

app.use(express.urlencoded({ extended: true }));

const mongoURI = 'mongodb://localhost:27017/gallery-uploader';

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
});
mongoose.Promise = global.Promise;
let gfs;

// const conn = mongoose.createConnection(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function(err, resp){
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});



// gridfs stuff

// mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);

// create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if(err) return reject(err);
                const filename = buf.toString('hex') + file.originalname;

                resolve({
                    filename: filename,
                    bucketName: 'uploads'
                })
            });
        });
    }
});


const upload = multer({ storage });
const { Image } = require('./models/image.model');


/* returns all images, displayed as stored objects */
app.get('/all-images/stored-objects', (req, res) => {
    
    gfs.files.find().toArray((err, files) => {
        if(!files || files.length === 0 || err) {
            res.json({err : "no file here"});
        }
        else {
            res.json(files);
        }
    });
});

/* returns all images, displayed as image objects */
app.get('/all-images/image-objects', (req, res) => {
    
    const retfiles = [];

    Image.find({}, (err, files) => {
        files.forEach(file => {
            retfiles.push(file.toJSON());
        });
        res.send(retfiles);
    });
    
});



/* get one specific image, displayed as object */
app.get('/:imagename/object', (req, res) => {
    gfs.files.findOne({filename: req.params.imagename}, (err, file) => {
        if(!file || file.length === 0 || err) {
            return res.status(404).json({
                err: 'No File Exists'
            });
        }
        return res.json(file);
    })
});

/* get one specific image, displayed as image */
app.get('/:imagename/image', (req, res) => {
    gfs.files.findOne({filename: req.params.imagename}, (err, file) => {
        if(!file || file.length === 0 || err) {
            return res.status(404).json({
                err: 'No File Exists'
            });
        }
        
        const readstream = gfs.createReadStream(file.filename);
        
        readstream.pipe(res);
        // res.type(file.mime);
        
        // gm(readstream)
        //     .resize('570', '200')
        //     .stream(function (err, stdout, stderr) {
        //     stdout.pipe(res);
        // });

    })
});

app.get('/:imagename/image-json', (req, res) => {
    Image.findOne({img: req.params.imagename}, (err, imgJson) => {
        res.json(imgJson);
    });
});


/* upload a single image */
app.post('/upload-image', upload.array('image-ref'), (req, res) => {
    let arrImgs = req.files;
    arrImgs.forEach(file => {
        // console.log('working on .... ', file);
        let newImage = new Image({
            title: req.body.title,
            description: req.body.description,
            img: file.filename
        });
        newImage.save()
        .then((imgdoc) => {
            console.log('Saved this guy ... \n', imgdoc.toJSON());
        })
        .catch(err => {
            console.log('Shit Error ... \n', err);
        });
    });
    

    res.end();
});

/**********THING TO NOTE : WHEN I USE MULTER AS MIDDLEWARE, IT LETS ME PARSE REQ.BODY (EVEN IF I SEND ONLY FORM DATA),
        OTHERWISE I WILL HAVE TO SEND IT VIA FORM-URLENCODED(POSTMAN)*************/

// app.post('/upload-om', (req, res) => {
//     console.log(req.body, req.filename, req.body.title, req.body.description);
//     let newImage = new Image({
//         title: req.body.title,
//         description: req.body.description,
//         img: "hi"
//     });
//     console.log(newImage);
//     newImage.save().then(imgdoc => console.log('hogaya'))
//     .catch(err => console.log(err) );

//     res.send('done bc');
//     // res.redirect('/all-images/objects');
// });


/* delete one specific image */
/*************REMOVE IS DEPRECATED --> DELETE FUNCTION MIGHT NOT WORK!!************/
app.delete('/:imagename', (req, res) => {
    console.log(req.params.imagename);
    Image.deleteOne({img: req.params.imagename}, (err, imgdel) => {
        if(err) { console.log(err); res.status(404).json({err: err}); }
        
    });
    gfs.remove({_id: req.params.imagename, root: 'uploads'}, (err, gridStore) => {
        if(err) { console.log(err); return res.status(404).json({err: err}); }
        res.sendStatus(200);
    });
});



app.listen(3000, () => {
    console.log("The server is running at port : 3000");
});