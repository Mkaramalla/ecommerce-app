<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Laptop',
                'description' => 'High performance laptop with Intel Core i7 processor, 16GB RAM, and 512GB SSD. Perfect for professional work and gaming.',
                'image' => 'https://picsum.photos/300/300?random=1',
                'price' => 999.99,
                'status' => 'active',
            ],
            [
                'name' => 'Wireless Mouse',
                'description' => 'Ergonomic wireless mouse with precision tracking and long battery life. Compatible with all devices.',
                'image' => 'https://picsum.photos/300/300?random=2',
                'price' => 29.99,
                'status' => 'active',
            ],
            [
                'name' => 'Mechanical Keyboard',
                'description' => 'RGB mechanical keyboard with customizable keys and tactile feedback. Perfect for gamers and typists.',
                'image' => 'https://picsum.photos/300/300?random=3',
                'price' => 79.99,
                'status' => 'active',
            ],
            [
                'name' => '27" Monitor',
                'description' => '4K Ultra HD 27-inch monitor with HDR support and 144Hz refresh rate. Stunning visuals for work and play.',
                'image' => 'https://picsum.photos/300/300?random=4',
                'price' => 299.99,
                'status' => 'active',
            ],
            [
                'name' => 'Noise Cancelling Headphones',
                'description' => 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Crystal clear audio quality.',
                'image' => 'https://picsum.photos/300/300?random=5',
                'price' => 199.99,
                'status' => 'inactive',
            ],
            [
                'name' => 'USB-C Hub',
                'description' => '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery. Essential for modern laptops.',
                'image' => 'https://picsum.photos/300/300?random=6',
                'price' => 49.99,
                'status' => 'active',
            ],
            [
                'name' => 'Webcam HD',
                'description' => '1080p HD webcam with auto-focus and built-in microphone. Perfect for video conferencing and streaming.',
                'image' => 'https://picsum.photos/300/300?random=7',
                'price' => 69.99,
                'status' => 'active',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
