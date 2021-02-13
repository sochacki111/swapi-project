import { Router } from 'express';

import StarshipsController from  '../controllers/starships.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/starships:
 *  get:
 *    summary: Get all starships
 *    tags:
 *      - starships
 *    description: Use to request all starships that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of all starships
 *        content:
 *          application/json:
 *            example:
 *              - id: '12'
 *                name: X-wing
 *              - id: '22'
 *                name: Imperial shuttle
 *      '401':
 *        description: User is unauthorized to get starships. User should login first
 *        content:
 *          application/json:
 *            example:
 *              Unauthorized
 */
router.get('/', jwtAuth, StarshipsController.findAll);

/**
 * @swagger
 * /api/starships/{id}:
 *  get:
 *    summary: Get a starship by id
 *    tags:
 *      - starships
 *    description: Use to request all starships that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of starship details
 *        content:
 *          application/json:
 *            example:
 *              name: X-wing
 *              model: T-65 X-wing
 *              manufacturer: Incom Corporation
 *              cost_in_credits: '149999'
 *              length: '12.5'
 *              max_atmosphering_speed: '1050'
 *              crew: '1'
 *              passengers: '0'
 *              cargo_capacity: '110'
 *              consumables: 1 week
 *              hyperdrive_rating: '1.0'
 *              MGLT: '100'
 *              starship_class: Starfighter
 *              pilots:
 *              - id: '1'
 *                name: Luke Skywalker
 *                hasAccess: true
 *              - id: '9'
 *                name: Biggs Darklighter
 *                hasAccess: false
 *              - id: '18'
 *                name: Wedge Antilles
 *                hasAccess: false
 *              - id: '19'
 *                name: Jek Tono Porkins
 *                hasAccess: false
 *              films:
 *              - id: '1'
 *                name: A New Hope
 *                hasAccess: true
 *              - id: '2'
 *                name: The Empire Strikes Back
 *                hasAccess: true
 *              - id: '3'
 *                name: Return of the Jedi
 *                hasAccess: true
 *      '401':
 *        description: User is unauthorized to get the starship. User should login first
 *        content:
 *          application/json:
 *            example:
 *              Unauthorized
 *      '403':
 *        description: User has not access to that resource
 *        content:
 *          application/json:
 *            example:
 *              Forbidden
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *          minimum: 1
 *        required: true
 *        description: Numeric id of the starship to get
 */
router.get('/:id', jwtAuth, StarshipsController.findOne);

export default router;
