/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and login
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: to register user
 *     tags: [Users]
 *     description: to register new user
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        username:
 *                            type: string
 *                        useremail:
 *                            type: string
 *                        password:
 *                            type: string
 *                        confirmpassword:
 *                            type: string
 *
 *     responses:
 *       200:
 *         description: successful registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  statusCode:
 *                    type: string
 *                  message:
 *                    type: string
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: to login user
 *     tags: [Users]
 *     description: to login user
 *     requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        username:
 *                            type: string
 *                        password:
 *                            type: string
 *
 *     responses:
 *       200:
 *         description: successful registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  statusCode:
 *                    type: string
 *                  message:
 *                    type: string
 *                  data:
 *                    type: object
 *                    properties:
 *                      token:
 *                        type: string
 */

/**
 * @swagger
 * /user/getUserInfo:
 *   get:
 *     summary: to get user info ater login
 *     tags: [Users]
 *     security:
 *       - BearerAuth: [YOUR_TOKEN_HERE]
 *     responses:
 *       200:
 *         description: Successfully accessed the protected route
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
