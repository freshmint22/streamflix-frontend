import { Request, Response } from 'express';
import User from '../models/Users';

// Editar cuenta
export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Solo permitimos editar ciertos campos
    const { name, email, avatar, password } = req.body;

    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (avatar) updatedData.avatar = avatar;
    if (password) updatedData.password = password; // se re-hasheará en el pre('save')

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    Object.assign(user, updatedData);
    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Borrar cuenta
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};