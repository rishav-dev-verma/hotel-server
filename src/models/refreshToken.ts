import  mongoose, { Document }  from 'mongoose';
import IRefreshToken from '../Interface/IRefreshToken';


const Schema = mongoose.Schema;

const refreshToken = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
     ref: 'User',
    required:true
  },
  expiredAt:{
    type:Date,
    required:true
  },
  revoked:{
    type:Date
  }
});

export default mongoose.model<IRefreshToken & Document>('resfreshTokenSchema' , refreshToken);
