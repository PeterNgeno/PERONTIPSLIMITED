// Route to delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await deleteProduct(req.params.id); // Corrected line here
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});
