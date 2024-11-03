/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project api endpoint
 */

/**
 * @swagger
 * /project/create:
 *   post:
 *     summary: create a new project
 *     description: To create new project
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: A list of users
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
 *                       userid:
 *                          type: number
 *                       projectid:
 *                          type: number
 *                       accessType:
 *                          type: number
 *                       user:
 *                          application/json:
 *                             schema: 
 *                                $ref: '#/swaggerSchema/user'
 */

/**
 * @swagger
 * /project/getProject:
 *   get:
 *     summary: to check services are available
 *     description: To check post request
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: A list of users
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
 * /project/active/getAllProject:
 *   put:
 *     summary: to check services are available
 *     description: To check post request
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: A list of users
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
 * /project/archive/getAllProject:
 *   put:
 *     summary: to check services are available
 *     description: To check post request
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: A list of users
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
 * /project/update:
 *   put:
 *     summary: to check services are available
 *     description: To check post request
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: A list of users
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
 * /project/delete:
 *   delete:
 *     summary: to check services are available
 *     description: To check post request
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: A list of users
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