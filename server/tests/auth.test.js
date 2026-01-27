const authController = require('../controllers/authController');
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');

jest.mock('../config/db');
jest.mock('bcryptjs');
jest.mock('../utils/jwtGenerator');

describe('AuthController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should return 400 if user already exists', async () => {
            req.body = { username: 'testuser', email: 'test@example.com' };
            pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith("User already exists");
        });

        it('should register a new user successfully', async () => {
            req.body = {
                username: 'newuser',
                password: 'password123',
                first_name: 'New',
                last_name: 'User',
                email: 'new@example.com'
            };
            pool.query.mockResolvedValueOnce({ rows: [] }); // Check if exists
            bcrypt.genSalt.mockResolvedValueOnce('salt');
            bcrypt.hash.mockResolvedValueOnce('hashedpassword');
            pool.query.mockResolvedValueOnce({ rows: [{ id: 2, username: 'newuser' }] }); // Insert
            jwtGenerator.mockReturnValueOnce('mocktoken');

            await authController.register(req, res);

            expect(res.json).toHaveBeenCalledWith({
                token: 'mocktoken',
                user: { id: 2, username: 'newuser' }
            });
        });
    });

    describe('login', () => {
        it('should return 401 if user not found', async () => {
            req.body = { username: 'missinguser', password: 'password' };
            pool.query.mockResolvedValueOnce({ rows: [] });

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith("Password or Username is incorrect");
        });

        it('should login successfully with correct credentials', async () => {
            req.body = { username: 'testuser', password: 'password123' };
            const mockUser = { id: 1, username: 'testuser', password: 'hashedpassword' };
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });
            bcrypt.compare.mockResolvedValueOnce(true);
            jwtGenerator.mockReturnValueOnce('mocktoken');

            await authController.login(req, res);

            expect(res.json).toHaveBeenCalledWith({
                token: 'mocktoken',
                user: mockUser
            });
        });
    });
});
