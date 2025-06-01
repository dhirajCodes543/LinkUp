import pkg from "@zegocloud/zego-uikit-prebuilt";
const { generateKitToken } = pkg;


const generateZegoToken = ({ roomId,userId,userName })=>{

    const appId = parseInt(process.env.ZEGOCLOUD_APP_ID)
    const serverSecret = process.env.ZEGOCLOUD_SERVER_SECRET;
    
    const kitToken = generateKitToken(
        appId,
        serverSecret,
        roomId,
        userId,
        userName,
        3600 // effective time in seconds
    );
    
    return kitToken;

}

export default generateZegoToken
