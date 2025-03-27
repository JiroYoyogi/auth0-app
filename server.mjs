import express from "express";
import cors from "cors";
import { auth, claimIncludes } from "express-oauth2-jwt-bearer";
import axios from "axios";

const app = express();
const port = process.env.PORT || 8080;

const jwtCheck = auth({
  audience: "",
  issuerBaseURL: "",
  tokenSigningAlg: "RS256",
});

// CORSを有効
app.use(cors());
// リクエストBodyを取得
app.use(express.json());

// 全てのリクエストでjwtのチェックをする
// app.use(jwtCheck);
const MANAGEMENT_API_DOMAIN = "";
const getAccessToken = async () => {
  const r = await axios.post(
    `${MANAGEMENT_API_DOMAIN}/oauth/token`,
    {
      client_id: "",
      client_secret: "",
      audience: "",
      grant_type: "client_credentials",
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return r.data.access_token;
};

let dbLikeCount = 999;

app.get("/likes", function (req, res) {
  res.json({
    count: dbLikeCount,
  });
});

app.post("/likes", jwtCheck, async function (req, res) {
  dbLikeCount++;
  res.json({
    count: dbLikeCount,
  });
});

app.delete(
  "/likes",
  jwtCheck,
  claimIncludes("permissions", "delete:like"),
  async function (req, res) {
    dbLikeCount--;
    res.json({
      count: dbLikeCount,
    });
  }
);

app.put("/users/:id/goldmember", async function (req, res) {
  const id = req.params.id;
	console.log(id);
  // マネジメントAPIのアクセストークンを取得
  const access_token = await getAccessToken();
	console.log(access_token);
  await axios.post(
    `${MANAGEMENT_API_DOMAIN}/api/v2/users/${encodeURIComponent(id)}/roles`,
    {
      roles: [""],
    },
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  res.json({
    message: "Ranked up.",
  });
});

app.delete("/users/:id/goldmember", async function (req, res) {
  const id = req.params.id;
  console.log(id);
  const access_token = await getAccessToken();
  console.log(access_token);
  await axios.delete(
    `${MANAGEMENT_API_DOMAIN}/api/v2/users/${encodeURIComponent(id)}/roles`,
    {
      headers: { Authorization: `Bearer ${access_token}` },
      data: { roles: [""] },
    }
  );

  res.json({
    message: "Rankded down.",
  });
});

app.listen(port);
console.log("Running on port ", port);
