const { prisma } = require("../prisma/prisma-client");

/**@route GET/api/consumers*/
/**@desc Get all consumers */
/**@access Private */

const all = async (req, res) => {
  try {
    const consumers = await prisma.consumer.findMany();

    res.status(200).json(consumers);
  } catch (error) {
    res.status(500).json({ message: "Error getting consumers" });
  }
};

/**@route POST/api/consumers/add*/
/**@desc Create consumers */
/**@access Private */

const add = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.phone || !data.diagnoz) {
      return res.status(400).json({ message: " All fields are required" });
    }

    const consumer = await prisma.consumer.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    return res.status(200).json(consumer);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**@route POST/api/consumers/remove/:id*/
/**@desc Delete consumers */
/**@access Private */

const remove = async (req, res) => {
  const { id } = req.body;

  try {
    await prisma.consumer.delete({
      where: {
        id,
      },
    });
    res.status(204).json("OK");
  } catch (error) {
    return res.status(500).json({ message: "Failed to DELETE consumer" });
  }
};

/**@route PUT/api/consumers/edit/:id*/
/**@desc Edit consumers */
/**@access Private */

const edit = async (req, res) => {
  const data = req.body;
  // const id = data.id;

  const { id } = req.params;

  try {
    await prisma.consumer.update({
      where: {
        id,
      },
      data,
    });

    res.status(204).json("OK");
  } catch (error) {
    return res.status(500).json({ message: "Failed to EDIT consumer" });
  }
};

/**@route GET/api/consumers/:id*/
/**@desc Get single consumer */
/**@access Private */

const consumer = async (req, res) => {
  const { id } = req.params;

  try {
    const consumer = await prisma.consumer.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(consumer);
  } catch (error) {
    return res.status(500).json({ message: "Failed Single consumer" });
  }
};

module.exports = {
  all,
  add,
  remove,
  edit,
  consumer,
};
