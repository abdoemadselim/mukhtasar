import type { Response } from "express";
import { IRequest } from "#features/qr/types.js";
import * as qrService from "#features/qr/domain/qr.service.js";
import { NoException } from "#lib/error-handling/error-types.js";

// ---------------------- Create QR Code ----------------------
export async function createQrCode(req: IRequest, res: Response) {
    console.log(req.body)
    //1- prepare the data for the service
    const userId = req.user?.id;
    const qrData = req.body;

    //2- pass the data to the service
    const createdQrCode = await qrService.createQrCode(qrData, userId as number);

    //3- prepare the response
    const response = {
        data: {
            qr_code: createdQrCode
        },
        errors: [],
        code: NoException.NoErrorCode,
        errorCode: NoException.NoErrorCodeString,
    }

    res.status(201).json(response)
}

// // ---------------------- Get QR Code by ID ----------------------
// export async function getQrCodeById(req: IRequest, res: Response) {
//     //1- prepare the data for the service
//     const userId = req.user?.id;
//     const { qrId } = req.params;

//     //2- pass the data to the service
//     const qrCode = await qrService.getQrCodeById(Number(qrId), userId as number);

//     //3- prepare the response
//     const response = {
//         data: {
//             qr_code: qrCode
//         },
//         errors: [],
//         code: NoException.NoErrorCode,
//         errorCode: NoException.NoErrorCodeString,
//     }

//     res.json(response)
// }

// // ---------------------- Get User QR Codes ----------------------
// export async function getUserQrCodes(req: IRequest, res: Response) {
//     //1- prepare the data for the service
//     const userId = req.user?.id;

//     //2- pass the data to the service
//     const qrCodes = await qrService.getUserQrCodes(userId as number);

//     //3- prepare the response
//     const response = {
//         data: {
//             qr_codes: qrCodes
//         },
//         errors: [],
//         code: NoException.NoErrorCode,
//         errorCode: NoException.NoErrorCodeString,
//     }

//     res.json(response)
// }

// // ---------------------- Delete QR Code ----------------------
// export async function deleteQrCode(req: IRequest, res: Response) {
//     //1- prepare the data for the service
//     const userId = req.user?.id;
//     const { qrId } = req.params;

//     //2- pass the data to the service
//     await qrService.deleteQrCode(Number(qrId), userId as number);

//     //3- prepare the response
//     const response = {
//         data: {
//             message: "QR Code deleted successfully"
//         },
//         errors: [],
//         code: NoException.NoErrorCode,
//         errorCode: NoException.NoErrorCodeString,
//     }

//     res.json(response)
// }

// // ---------------------- Get QR Code Analytics ----------------------
// export async function getQrAnalytics(req: IRequest, res: Response) {
//     //1- prepare the data for the service
//     const userId = req.user?.id;
//     const { qrId } = req.params;

//     //2- pass the data to the service
//     const analytics = await qrService.getQrAnalytics(Number(qrId), userId as number);

//     //3- prepare the response
//     const response = {
//         data: {
//             analytics
//         },
//         errors: [],
//         code: NoException.NoErrorCode,
//         errorCode: NoException.NoErrorCodeString,
//     }

//     res.json(response)
// }
