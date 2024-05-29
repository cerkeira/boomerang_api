const User = require('../models/user');
const Location = require('../models/location');

exports.editLocation = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const {
 id, locationName, address, postalCode 
} = req.body;

        const user = await User.findOne({ where: { username: loggedUser } });

        const userLocation = await Location.findByPk(id);

        if (!userLocation || userLocation.UserId !== user.id) {
            return res.status(404).json({
                message: 'Location not found or does not belong to the user',
            });
        }

        await userLocation.update({ name: locationName, address, postalCode });

        res.status(200).json({ message: 'Location updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to edit location.' });
    }
};

exports.listUserLocations = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findOne({ where: { username: loggedUser } });

        const userLocations = await user.getLocations();

        res.status(200).json(userLocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to list user locations.' });
    }
};

exports.addLocation = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { locationName, address, postalCode } = req.body;

        const user = await User.findOne({ where: { username: loggedUser } });

        const newLocation = await Location.create({
            name: locationName,
            address,
            postalCode,
        });
        await user.addLocation(newLocation);

        res.status(200).json({ message: 'Location added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add location.' });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { id } = req.query;

        const user = await User.findOne({ where: { username: loggedUser } });

        const userLocation = await Location.findByPk(id);

        if (!userLocation || userLocation.UserId !== user.id) {
            return res.status(404).json({
                message: 'Location not found or does not belong to the user',
            });
        }

        await userLocation.destroy();

        res.status(200).json({ message: 'Location deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete location.' });
    }
};
