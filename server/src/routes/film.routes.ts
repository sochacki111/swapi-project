import { Router } from 'express';

import FilmsController from '../controllers/films.controller';
import { jwtAuth } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /api/films:
 *  get:
 *    summary: Get all films
 *    tags:
 *      - films
 *    description: Use to request all films that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of all films
 *        content:
 *          application/json:
 *            example:
 *              - id: '1'
 *                title: A New Hope
 *              - id: '2'
 *                title: The Empire Strikes Back
 *              - id: '3'
 *                title: Return of the Jedi
 *              - id: '6'
 *                title: Revenge of the Sith
 *      '401':
 *        description: User is unauthorized to get films. User should login first
 *        content:
 *          application/json:
 *            example:
 *              Unauthorized
 */
router.get('/', jwtAuth, FilmsController.findAll);
/**
 * @swagger
 * /api/films/{id}:
 *  get:
 *    summary: Get a film by id
 *    tags:
 *      - films
 *    description: Use to request all films that user has access to
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response of film details
 *        content:
 *          application/json:
 *            example:
 *              title: A New Hope
 *              episode_id: 4
 *              opening_crawl: "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom
 *                  a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring
 *                  the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate
 *                  weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy
 *                  an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia
 *                  races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save
 *                  her\r\npeople and restore\r\nfreedom to the galaxy...."
 *              director: George Lucas
 *              producer: Gary Kurtz, Rick McCallum
 *              release_date: '1977-05-25'
 *              characters:
 *              - id: '1'
 *                name: Luke Skywalker
 *                hasAccess: true
 *              - id: '2'
 *                name: C-3PO
 *                hasAccess: false
 *              - id: '3'
 *                name: R2-D2
 *                hasAccess: false
 *              - id: '4'
 *                name: Darth Vader
 *                hasAccess: false
 *              - id: '5'
 *                name: Leia Organa
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
 *              - id: '10'
 *                name: Obi-Wan Kenobi
 *                hasAccess: false
 *              - id: '12'
 *                name: Wilhuff Tarkin
 *                hasAccess: false
 *              - id: '13'
 *                name: Chewbacca
 *                hasAccess: false
 *              - id: '14'
 *                name: Han Solo
 *                hasAccess: false
 *              - id: '15'
 *                name: Greedo
 *                hasAccess: false
 *              - id: '16'
 *                name: Jabba Desilijic Tiure
 *                hasAccess: false
 *              - id: '18'
 *                name: Wedge Antilles
 *                hasAccess: false
 *              - id: '19'
 *                name: Jek Tono Porkins
 *                hasAccess: false
 *              - id: '81'
 *                name: Raymus Antilles
 *                hasAccess: false
 *              planets:
 *              - id: '1'
 *                name: Tatooine
 *                hasAccess: true
 *              - id: '2'
 *                name: Alderaan
 *                hasAccess: false
 *              - id: '3'
 *                name: Yavin IV
 *                hasAccess: false
 *              starships:
 *              - id: '2'
 *                name: CR90 corvette
 *                hasAccess: false
 *              - id: '3'
 *                name: Star Destroyer
 *                hasAccess: false
 *              - id: '5'
 *                name: Sentinel-class landing craft
 *                hasAccess: false
 *              - id: '9'
 *                name: Death Star
 *                hasAccess: false
 *              - id: '10'
 *                name: Millennium Falcon
 *                hasAccess: false
 *              - id: '11'
 *                name: Y-wing
 *                hasAccess: false
 *              - id: '12'
 *                name: X-wing
 *                hasAccess: true
 *              - id: '13'
 *                name: TIE Advanced x1
 *                hasAccess: false
 *              vehicles:
 *              - id: '4'
 *                name: Sand Crawler
 *                hasAccess: false
 *              - id: '6'
 *                name: T-16 skyhopper
 *                hasAccess: false
 *              - id: '7'
 *                name: X-34 landspeeder
 *                hasAccess: false
 *              - id: '8'
 *                name: TIE/LN starfighter
 *                hasAccess: false
 *              species:
 *              - id: '1'
 *                name: Human
 *                hasAccess: false
 *              - id: '2'
 *                name: Droid
 *                hasAccess: false
 *              - id: '3'
 *                name: Wookie
 *                hasAccess: false
 *              - id: '4'
 *                name: Rodian
 *                hasAccess: false
 *              - id: '5'
 *                name: Hutt
 *                hasAccess: false
 *      '401':
 *        description: User is unauthorized to get the film. User should login first
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
 *        description: Numeric id of the film to get
 */
router.get('/:id', jwtAuth, FilmsController.findOne);

export default router;
