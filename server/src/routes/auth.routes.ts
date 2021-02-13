import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Authentication:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: "example@email.com"
 *         password:
 *            type: string
 *            example: "toor"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "The User already exists"
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    summary: Register
 *    tags:
 *      - auth
 *    description: Create new account and assign random Star Wars hero to it
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Authentication"
 *    responses:
 *      '201':
 *        description: Successful user register
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  example: "6019bb4ec7a8c86dc89302c0"
 *                email:
 *                  type: string
 *                  example: "example@email.com"
 *                swapiHeroId:
 *                  type: string
 *                  example: "58"
 *      '400':
 *        description: The User already exists or missing credentials
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Error"
 */
router.post('/register', AuthController.register);
/**
 * @swagger
 * /api/auth/signin:
 *  post:
 *    summary: Sign in
 *    tags:
 *      - auth
 *    description: Use to request all films that user has access to
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/Authentication"
 *    responses:
 *      '200':
 *        description: Successful sign in
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  example: "6019bb4ec7a8c86dc89302c0"
 *                email:
 *                  type: string
 *                  example: "example@email.com"
 *                idToken:
 *                  type: string
 *                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTliYjRlYzdhOGM4NmRjODkzMDJjMCIsImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20iLCJpYXQiOjE2MTMyMjc3OTAsImV4cCI6MTYxMzIzMTM5MH0.F2UTmIXyp9v4fQr62888DTgGadbwe8HMnB7B45CMwO8"
 *                expiresIn:
 *                  type: string
 *                  example: 3600 
 *      '400':
 *        description: Missing or incorrect credentials
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "The User does not exists"
 */
router.post('/signin', AuthController.signIn);

export default router;
