import { Router } from 'express';

import VehiclesController from  '../controllers/vehicles.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/vehicles:
 *  get:
 *    summary: Get all vehicles
 *    tags:
 *      - vehicles
 *    description: Use to request all vehicles that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of all vehicles
 *        content:
 *          application/json:
 *            example:
 *              - id: '14'
 *                name: Snowspeeder
 *              - id: '30'
 *                name: Imperial Speeder Bike
 *      '401':
 *        description: User is unauthorized to get vehicles. User should login first
 *        content:
 *          application/json:
 *            example:
 *              Unauthorized
 */
router.get('/', jwtAuth, VehiclesController.findAll);

/**
 * @swagger
 * /api/vehicles/{id}:
 *  get:
 *    summary: Get a vehicle by id
 *    tags:
 *      - vehicles
 *    description: Use to request all vehicles that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of vehicle details
 *        content:
 *          application/json:
 *            example:
 *              name: Snowspeeder
 *              model: t-47 airspeeder
 *              manufacturer: Incom corporation
 *              cost_in_credits: unknown
 *              length: '4.5'
 *              max_atmosphering_speed: '650'
 *              crew: '2'
 *              passengers: '0'
 *              cargo_capacity: '10'
 *              consumables: none
 *              vehicle_class: airspeeder
 *              pilots:
 *              - id: '1'
 *                name: Luke Skywalker
 *                hasAccess: true
 *              - id: '18'
 *                name: Wedge Antilles
 *                hasAccess: false
 *              films:
 *              - id: '2'
 *                name: The Empire Strikes Back
 *                hasAccess: true
 *      '401':
 *        description: User is unauthorized to get the vehicle. User should login first
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
 *        description: Numeric id of the vehicle to get
 */
router.get('/:id', jwtAuth, VehiclesController.findOne);

export default router;
