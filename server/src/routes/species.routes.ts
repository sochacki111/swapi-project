import { Router } from 'express';

import SpeciesController from  '../controllers/species.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/species:
 *  get:
 *    summary: Get all species
 *    tags:
 *      - species
 *    description: Use to request all species that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of all species
 *        content:
 *          application/json:
 *            example:
 *              - id: '1'
 *                name: Human
 *      '401':
 *        description: User is unauthorized to get species. User should login first
 *        content:
 *          application/json:
 *            example:
 *              Unauthorized
 */
router.get('/', jwtAuth, SpeciesController.findAll);

/**
 * @swagger
 * /api/species/{id}:
 *  get:
 *    summary: Get a species by id
 *    tags:
 *      - species
 *    description: Use to request all species that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of species details
 *        content:
 *          application/json:
 *            example:
 *              name: Human
 *              classification: mammal
 *              designation: sentient
 *              average_height: '180'
 *              skin_colors: caucasian, black, asian, hispanic
 *              hair_colors: blonde, brown, black, red
 *              eye_colors: brown, blue, green, hazel, grey, amber
 *              average_lifespan: '120'
 *              homeworld:
 *                id: '9'
 *                name: Coruscant
 *                hasAccess: false
 *              language: Galactic Basic
 *              people:
 *              - id: '66'
 *                name: Dormé
 *                hasAccess: true
 *              - id: '67'
 *                name: Dooku
 *                hasAccess: false
 *              - id: '68'
 *                name: Bail Prestor Organa
 *                hasAccess: false
 *              - id: '74'
 *                name: Jocasta Nu
 *                hasAccess: false
 *              films:
 *              - id: '1'
 *                name: A New Hope
 *                hasAccess: false
 *              - id: '2'
 *                name: The Empire Strikes Back
 *                hasAccess: false
 *              - id: '3'
 *                name: Return of the Jedi
 *                hasAccess: false
 *              - id: '4'
 *                name: The Phantom Menace
 *                hasAccess: false
 *              - id: '5'
 *                name: Attack of the Clones
 *                hasAccess: true
 *              - id: '6'
 *                name: Revenge of the Sith
 *                hasAccess: false
 *              
 *      '401':
 *        description: User is unauthorized to get the species. User should login first
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
 *        description: Numeric id of the species to get
 */
router.get('/:id', jwtAuth, SpeciesController.findOne);

export default router;
