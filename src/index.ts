import express, {Request, Response} from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

//Types
type CreateUpdateVideoInputModel = {
    title: string
}

type FieldError = {
    "message": string,
    "field": string
}

type APIErrorResult = {
    errorsMessages: Array<FieldError>
}

type Video = {
    id: number,
    title: string,
    author: string
}

//Constants
const parserMiddleware = bodyParser({})
const port = process.env.PORT || 5000
const videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]
const app = express()

app.use(cors())
app.use(parserMiddleware)

app.get('/videos', (req: Request, res: Response)=>{
    res.status(200).send(videos)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id: number = +req.params.videoId;
    const video: Video | undefined = videos.find(v => v.id === id)
    if(!video) res.status(404).send('Not found')
    res.status(200).send(video)
})
app.post('/videos', (req: Request, res: Response) => {
    if(req.body.title) {
        if(req.body.title.length > 40){
            res.status(400).send("The field Title must be a string or array type with a maximum length of '40'.")
        }
        const titleReq: CreateUpdateVideoInputModel = {title: req.body.title}
        const newVideo: Video = {
            id: +(new Date()),
            title: titleReq.title,
            author: 'it-incubator.eu'
        }
        videos.push(newVideo)
        res.status(201).send(newVideo)
    }
    else{
        const errorMessage: APIErrorResult = {
            errorsMessages: [{
                message: "Field title not found",
                field: "title"
            }]
        }
        res.status(400).send(errorMessage)
    }
})

app.delete('/videos/:id',(req: Request, res: Response)=>{
    const id: number = +req.params.id;
       for(let i = 0; i < videos.length; i++){
        if(videos[i].id === id) {
            videos.splice(i, 1)
            res.status(204).send('No Content')
            return
        }
    }
    res.status(404).send('Not found')
})

app.put('/videos/:id',(req: Request, res: Response)=>{
    if(req.body.title) {
        if(req.body.title.length > 40){
            res.status(400).send("The field Title must be a string or array type with a maximum length of '40'.")
        }
        const id: number = +req.params.id;
        const titleReq: CreateUpdateVideoInputModel = {title: req.body.title}
        const video: Video | undefined = videos.find(v => v.id === id)
        if (video) {
            video.title = titleReq.title
            res.status(204).send(video)
        }
        res.status(404).send('NotFound')
    }
    else{
        const errorMessage: APIErrorResult = {
            errorsMessages: [{
                message: "Field title not found",
                field: "title"
            }]
        }
        res.status(400).send(errorMessage)
    }

})

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})