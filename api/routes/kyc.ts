import { Router } from 'express';
import prisma from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import multer from 'multer';
import { put } from '@vercel/blob';

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/submit', authenticate, upload.fields([
  { name: 'front', maxCount: 1 },
  { name: 'back', maxCount: 1 },
  { name: 'selfie', maxCount: 1 },
  { name: 'proof', maxCount: 1 }
]), async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Construct paths payload
    const documentDataObj: Record<string, string> = {};
    if (files) {
      for (const key of ['front', 'back', 'selfie', 'proof']) {
        if (files[key] && files[key][0]) {
          const file = files[key][0];
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const filename = `${key}-${uniqueSuffix}-${file.originalname}`;
          
          const blob = await put(filename, file.buffer, {
            access: 'public',
          });
          documentDataObj[key] = blob.url;
        }
      }
    }
    
    // Add any text fields if they were passed (like first name, last name, DOB, address)
    // For now we just merge them into the documentData string
    const mergedData = {
      ...req.body,
      ...documentDataObj
    };

    const documentData = JSON.stringify(mergedData);

    // Check if pending KYC exists
    const existingKyc = await prisma.kycRequest.findFirst({
      where: { userId, status: 'PENDING' }
    });
    if (existingKyc) {
      return res.status(400).json({ error: 'KYC request already pending' });
    }

    const kycRequest = await prisma.kycRequest.create({
      data: {
        userId,
        documentData,
        status: 'PENDING'
      }
    });

    res.json({ kycRequest });
  } catch (error) {
    console.error('Error in KYC submit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/status', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    res.json({ kycStatus: user?.kycStatus });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
