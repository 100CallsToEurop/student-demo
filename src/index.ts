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

app.get('/lesson_01/api/videos', (req: Request, res: Response)=>{
    res.status(200).send(videos)
})
app.get('/lesson_01/api/videos/:videoId', (req: Request, res: Response) => {
    const id: number = +req.params.videoId;
    const video: Video | undefined = videos.find(v => v.id === id)
    if(!video) res.status(404).send('Not found')
    res.status(200).send(video)
})
app.post('/lesson_01/api/videos', (req: Request, res: Response) => {
    if(!req.body.title) {
        const errorMessage: APIErrorResult = {
            errorsMessages: [{
                message: "Field title not found",
                field: "title"
            }]
        }
        res.status(400).send(errorMessage)
    }
    const titleReq: CreateUpdateVideoInputModel = { title: req.body.title}
    const newVideo: Video = {
       id: +(new Date()),
          title: titleReq.title,
           author: 'it-incubator.eu'
       }
       videos.push(newVideo)
       res.status(201).send(newVideo)
})

app.delete('/lesson_01/api/videos/:id',(req: Request, res: Response)=>{
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

app.put('/lesson_01/api/videos/:id',(req: Request, res: Response)=>{
    if(!req.body.title) {
        const errorMessage: APIErrorResult = {
            errorsMessages: [{
                message: "Field title not found",
                field: "title"
            }]
        }
        res.status(400).send(errorMessage)
    }
    const id: number = +req.params.id;
    const titleReq: CreateUpdateVideoInputModel = { title: req.body.title }
    const video: Video | undefined = videos.find(v => v.id === id)
    if(video){
        video.title = titleReq.title
        res.status(204).send(video)
    }
    res.status(404).send('NotFound')

})

app.listen(port, ()=>{
    console.log(`Example app listening on port ${port}`)
})