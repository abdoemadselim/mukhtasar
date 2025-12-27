import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import r2 from "./r2-client.js";

// async function upload(file) {
//     const fileContent = fs.readFileSync("qr.png");
  
//     const uploadParams = {
//       Bucket: "minimourl-qr-prod",
//       Key: "qr/42/abc123.png",
//       Body: fileContent,
//       ContentType: "image/png",
//     };
  
//     await r2.send(new PutObjectCommand(uploadParams));
  
//     console.log("✅ Uploaded to R2!");
//   }