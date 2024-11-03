/**
 * @swagger
 * tags:
 *   name: Dummy
 *   description: Dummy api endpoint
 */

/**
 * @swagger
 * /dummy/getCall:
 *   get:
 *     summary: to check services are available
 *     tags: [Dummy]
 *     description: To check post request
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
 * /dummy/postCall:
 *   post:
 *     summary: test post request
 *     tags: [Dummy]
 *     description: To check post request
 *     requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              responseText:
 *                                  type: string
 *                                  example: This is some example string! This is an endpoint
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  username:
 *                    type: string
 *                    description: The user's username.
 *                    example: johndoe
 *                  useremail:
 *                    type: string
 *                    description: The user's email address.
 *                    example: johndoe@example.com
 *       400:
 *         description: Bad Request - Invalid input
 */
