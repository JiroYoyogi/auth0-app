import express from 'express'
import cors from 'cors';
const app = express();
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer';
const port = process.env.PORT || 8080;

const jwtCheck = auth({
  audience: '',
  issuerBaseURL: '',
  tokenSigningAlg: 'RS256'
});

// CORSを有効
app.use(cors());
// リクエストBodyを取得
app.use(express.json()); 

// 全てのリクエストでjwtのチェックをする
// app.use(jwtCheck);

let dbLikeCount = 999;

app.get('/likes', function (req, res) {
    res.json({
        count: dbLikeCount
    });
});

app.post('/likes', jwtCheck, async function (req, res) {
    dbLikeCount++;
    res.json({
        count: dbLikeCount
    });
});

app.listen(port);
console.log('Running on port ', port);