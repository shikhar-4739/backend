import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    
    // get user details feom frontend
    // validate for non-empty
    // check if user already exists: username, email
    // check for images , check for avatar
    // upload to cloudinary, avatar
    // create user object - create entry in database
    //remove password and refresh token field from response
    // return response 

    const {fullName, email, username, password } = req.body    // req.body sei hum frontend sei data nikalte hai
    console.log( "email: ", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")        // validation
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({                     // checking for existing User
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)             // upload to cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({                                      // creating object to enter in db
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select( "-password -refreshToken" )   // checking the user is created or not and remove the password and refresh token

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export { registerUser }