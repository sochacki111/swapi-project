import { Router } from 'express';

import PlanetsController from  '../controllers/planets.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/planets:
 *  get:
 *    summary: Get all planets
 *    tags:
 *      - planets
 *    description: Use to request all planets that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of all planets
 *        content:
 *          application/json:
 *            example:
 *              - id: '1'
 *                name: Tatooine
 *      '401':
 *        description: User is unauthorized to get planets. User should login first
 *        content:
 *          application/json:
 *            example:
 *              Unauthorized
 */
router.get('/', jwtAuth, PlanetsController.findAll);

/**
 * @swagger
 * /api/planets/{id}:
 *  get:
 *    summary: Get a planet by id
 *    tags:
 *      - planets
 *    description: Use to request all planets that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of planet details
 *        content:
 *          application/json:
 *            example:
 *              name: Tatooine
 *              rotation_period: '23'
 *              orbital_period: '304'
 *              diameter: '10465'
 *              climate: arid
 *              gravity: 1 standard
 *              terrain: desert
 *              surface_water: '1'
 *              population: '200000'
 *              residents:
 *              - id: '1'
 *                name: Luke Skywalker
 *                hasAccess: true
 *              - id: '2'
 *                name: C-3PO
 *                hasAccess: false
 *              - id: '4'
 *                name: Darth Vader
 *                hasAccess: false
 *              - id: '6'
 *                name: Owen Lars
 *                hasAccess: false
 *              - id: '7'
 *                name: Beru Whitesun lars
 *                hasAccess: false
 *              - id: '8'
 *                name: R5-D4
 *                hasAccess: false
 *              - id: '9'
 *                name: Biggs Darklighter
 *                hasAccess: false
 *              - id: '11'
 *                name: Anakin Skywalker
 *                hasAccess: false
 *              - id: '43'
 *                name: Shmi Skywalker
 *                hasAccess: false
 *              - id: '62'
 *                name: Cliegg Lars
 *                hasAccess: false
 *              planets:
 *              - id: '1'
 *                name: A New Hope
 *                hasAccess: true
 *              - id: '3'
 *                name: Return of the Jedi
 *                hasAccess: true
 *              - id: '4'
 *                name: The Phantom Menace
 *                hasAccess: false
 *              - id: '5'
 *                name: Attack of the Clones
 *                hasAccess: false
 *              - id: '6'
 *                name: Revenge of the Sith
 *                hasAccess: true
 *      '401':
 *        description: User is unauthorized to get the planet. User should login first
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
 *        description: Numeric id of the planet to get
 */
router.get('/:id', jwtAuth, PlanetsController.findOne);

export default router;
