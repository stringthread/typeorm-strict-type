const EntityNominality = Symbol();

/**
 * Class to discriminate entity from others
 *
 * This class provides no actual functionalities.
 */
export abstract class Entity {
  private [EntityNominality] = EntityNominality;
}
