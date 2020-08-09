import express, {Request, Response} from 'express';

const app = express();

app.get('/api', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'hello world!',
    });
})


app.listen(5000, () => console.log('Up on 5000'));