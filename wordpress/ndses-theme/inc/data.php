<?php
/**
 * Local structured fallback content.
 *
 * TODO: ACF - Replace these defaults with WordPress ACF fields and CPT content.
 */

if (!defined('ABSPATH')) {
    exit;
}

function ndses_data(): array
{
    static $data = null;

    if ($data !== null) {
        return $data;
    }

    $mission = "NDS Environmental Solutions is a locally owned and operated business. Our mission is to provide reliable, affordable, and eco-friendly waste collection services that strengthen Wisconsin's communities. We pride ourselves on delivering personalized service with a deep commitment to our neighbors.";
    $accepted_recycling = ['Aluminum and steel cans', 'Food and beverage cartons and containers, non-styrofoam', 'Glass bottles and jars', 'Flattened cardboard', 'Paper', 'Cereal boxes', 'Plastic bottles and containers'];
    $recycling_not_accepted = ['Scrap metal', 'Construction debris', 'Styrofoam'];
    $recycling_never = ['Flammables', 'Sharps', 'Wires', 'Batteries', 'Hoses', 'Diapers', 'Household hazardous waste', 'Compressed cylinders', 'Electronics of any kind'];
    $bulk_accepted = ['Household furniture', 'Mattresses', 'Appliances may require a fee'];
    $bulk_not = ['Pools', 'Hot tubs', 'Swing sets', 'Yard waste', 'Construction or remodeling debris'];
    $rolloff_accepted = ['Wood', 'Furniture', 'Construction debris', 'Drywall', 'Roofing shingles', 'Cardboard', 'Household junk'];
    $rolloff_prohibited = ['Paint', 'Batteries', 'Tires', 'Hazardous chemicals', 'Propane tanks', 'Electronics', 'Appliances', 'Yard waste', 'Mattresses'];
    $included = ['2 tons of trash', '15 day rental', 'Delivery and pickup', 'Disposal'];

    $data = [
        'settings' => [
            'company_name' => 'NDS Environmental Solutions',
            'legal_name' => 'NDS Environmental Solutions, LLC.',
            'phone' => '262-233-6131',
            'email' => 'info@ndses.com',
            'address' => '1635 Mound Rd, Delavan, WI 53115',
            'mailing_address' => 'PO Box 464, Delavan, WI 53115',
            'hours' => ['Monday - Thursday: 8:00am - 4:00pm', 'Friday: 8:00am - 2:00pm'],
            'service_area' => 'Southern Wisconsin, including Walworth County and select areas of Rock, Jefferson, Waukesha, and Kenosha counties.',
            'facebook' => 'https://www.facebook.com/',
            'instagram' => 'https://www.instagram.com/',
        ],
        'mission' => $mission,
        'nav' => [
            ['label' => 'Residential', 'url' => '/residential'],
            ['label' => 'Commercial', 'url' => '/commercial'],
            ['label' => 'Dumpster Rentals', 'url' => '/dumpster-rentals'],
            ['label' => 'Calculator', 'url' => '/dumpster-calculator'],
            ['label' => 'FAQs', 'url' => '/faqs'],
            ['label' => 'What\'s New', 'url' => '/whats-new'],
            ['label' => 'Contact', 'url' => '/contact'],
        ],
        'pages' => [
            'home' => [
                'eyebrow' => 'Southern Wisconsin Waste Management',
                'heading' => 'Reliable local trash, recycling, and dumpster service',
                'description' => 'A local waste management provider in Southern Wisconsin, delivering honest, reliable, and environmentally conscious solutions to individuals, businesses, and communities.',
                'image' => 'home-page-01-ea0d03de5d.png',
            ],
            'residential' => [
                'eyebrow' => 'Residential Communities Serviced',
                'heading' => 'Residential trash and recycling by community',
                'description' => 'Curbside and drive-up garbage and recycling services for Town of Walworth, Town of Delavan, City of Delavan, Town of Darien, and Town of Sharon.',
            ],
            'commercial' => [
                'eyebrow' => 'Commercial Waste Management',
                'heading' => 'Commercial waste and recycling tailored to your business',
                'description' => 'Permanent trash and recycling dumpsters with flexible collection schedules for businesses in Walworth County and select nearby areas.',
            ],
            'dumpster-rentals' => [
                'eyebrow' => 'Dumpster Rentals',
                'heading' => 'Temporary roll-off dumpsters for cleanouts, remodels, and projects',
                'description' => 'Competitive pricing, prompt delivery, and responsive service for roll-off dumpster rentals in Walworth and surrounding counties.',
            ],
            'dumpster-calculator' => [
                'eyebrow' => 'Dumpster Calculator',
                'heading' => 'Find the right dumpster size before you call',
                'description' => 'Answer a few project questions and compare roll-off sizes before requesting a quote.',
            ],
            'faqs' => [
                'eyebrow' => 'FAQs',
                'heading' => 'Answers for homeowners, businesses, and project planners',
                'description' => 'Quick guidance for pickup schedules, recycling, dumpster rentals, and commercial service.',
            ],
            'about' => [
                'eyebrow' => 'About NDS',
                'heading' => 'Local waste service built around Wisconsin communities',
                'description' => 'Learn about the mission, history, and team behind NDS Environmental Solutions.',
            ],
            'contact' => [
                'eyebrow' => 'Contact NDS',
                'heading' => 'Request a quote, estimate, or service answer',
                'description' => 'Send a message and the NDS team will help route your request.',
            ],
            'make-a-payment' => [
                'eyebrow' => 'Make a Payment',
                'heading' => 'Payment and ACH forms prepared for PayEngine',
                'description' => 'This page is ready for the PayEngine integration. Do not enter real card or bank details until live processing is connected.',
            ],
            'whats-new' => [
                'eyebrow' => 'What\'s New',
                'heading' => 'Service alerts, updates, and local notices',
                'description' => 'Weather delays, holiday updates, route notices, and announcements will appear here.',
            ],
        ],
        'services' => [
            ['title' => 'Residential Trash & Recycling', 'body' => 'Curbside and drive-up garbage and recycling services depending on your community.', 'url' => '/residential', 'image' => 'residential-bins-curbside.jpg'],
            ['title' => 'Commercial Trash & Recycling', 'body' => 'Permanent trash and recycling dumpsters with collection schedules matched to your business.', 'url' => '/commercial', 'image' => 'commercial-cardboard-dumpster.jpg'],
            ['title' => 'Dumpster Rentals', 'body' => 'Temporary roll-off dumpsters for renovations, construction debris, cleanouts, and events.', 'url' => '/dumpster-rentals', 'image' => 'dumpster-rental-rolloff.jpg'],
        ],
        'communities' => [
            'town-of-walworth' => ndses_community_seed('Town of Walworth', 'Town', 'Thursday', 'Weekly', 'Every Other Week (see service calendar and map below)', 'We will collect up to the equivalent of four 32-gallon cans each week for both trash and recycle.', $mission, $accepted_recycling, $recycling_not_accepted, $recycling_never, $bulk_accepted, $bulk_not),
            'town-of-delavan' => ndses_community_seed('Town of Delavan', 'Town', 'Monday', 'Weekly, Every Other Week, Monthly', 'Weekly, Every Other Week, Monthly', 'We will collect up to the equivalent of three 32-gallon cans each week for both trash and recycle.', $mission, $accepted_recycling, $recycling_not_accepted, $recycling_never, $bulk_accepted, $bulk_not),
            'city-of-delavan' => ndses_community_seed('City of Delavan', 'City', 'Wednesday', 'Weekly, Every Other Week, Monthly', 'Weekly, Every Other Week, Monthly', 'We will collect up to the equivalent of three 32-gallon cans each week for both trash and recycle.', $mission, $accepted_recycling, $recycling_not_accepted, $recycling_never, $bulk_accepted, $bulk_not),
            'town-of-darien' => ndses_community_seed('Town of Darien', 'Town', 'Tuesday', 'Weekly, Every Other Week, Monthly', 'Weekly, Every Other Week, Monthly', 'We will collect up to the equivalent of three 32-gallon cans each week for both trash and recycle.', $mission, $accepted_recycling, $recycling_not_accepted, $recycling_never, $bulk_accepted, $bulk_not),
            'town-of-sharon' => ndses_community_seed('Town of Sharon', 'Town', 'Tuesday', 'Weekly, Every Other Week, Monthly', 'Weekly, Every Other Week, Monthly', 'We will collect up to the equivalent of three 32-gallon cans each week for both trash and recycle.', $mission, $accepted_recycling, $recycling_not_accepted, $recycling_never, $bulk_accepted, $bulk_not),
        ],
        'dumpsters' => [
            ['name' => '10/12 Yard Dumpster', 'slug' => '10-12-yard', 'capacity' => '4-5 truck loads', 'uses' => ['Small/medium remodeling projects', 'Home cleanouts', 'Concrete/heavy materials'], 'included' => $included, 'image' => 'dumpster-calculator---com-temp-01-316b2e7632.png'],
            ['name' => '15 Yard Dumpster', 'slug' => '15-yard', 'capacity' => '6 truck loads', 'uses' => ['Kitchen remodels', 'Multi-room renovations', 'Moderate construction debris'], 'included' => $included, 'image' => 'dumpster-calculator---com-temp-02-2f0227232b.png'],
            ['name' => '20 Yard Dumpster', 'slug' => '20-yard', 'capacity' => '8 truck loads', 'uses' => ['Large home renovations', 'Whole-house cleanouts', 'Moderate construction debris'], 'included' => $included, 'image' => 'dumpster-calculator---com-temp-04-447a7c0385.png'],
            ['name' => '30 Yard Dumpster', 'slug' => '30-yard', 'capacity' => '14 truck loads', 'uses' => ['Major construction projects', 'Large demolition projects', 'Large-scale remodeling projects'], 'included' => $included, 'image' => 'dumpster-calculator---com-temp-03-20780e623e.png'],
        ],
        'commercial_containers' => [
            ['name' => '96 Gallon', 'body' => 'Compact container for lower-volume recurring trash or recycling service.', 'ideal' => ['Small offices', 'Low-volume retail', 'Churches']],
            ['name' => '2 Yard', 'body' => 'Small rear-load dumpster for businesses with steady weekly disposal needs.', 'ideal' => ['Restaurants', 'Small retail', 'Offices']],
            ['name' => '4 Yard', 'body' => 'Mid-size commercial container for growing waste streams.', 'ideal' => ['Retail stores', 'Apartment complexes', 'Schools']],
            ['name' => '6 Yard', 'body' => 'Larger container for busy sites that need more capacity.', 'ideal' => ['Restaurants', 'Manufacturing', 'Apartment complexes']],
            ['name' => '8 Yard', 'body' => 'High-capacity permanent dumpster for demanding commercial accounts.', 'ideal' => ['Manufacturing', 'Schools', 'Large retail']],
        ],
        'faqs' => ndses_faq_seed(),
        'accepted_materials' => $rolloff_accepted,
        'prohibited_materials' => $rolloff_prohibited,
        'service_areas' => [
            ['name' => 'Town of Walworth', 'county' => 'Walworth County', 'types' => ['Residential', 'Commercial', 'Roll-off'], 'x' => 49, 'y' => 45],
            ['name' => 'Town of Delavan', 'county' => 'Walworth County', 'types' => ['Residential', 'Commercial', 'Roll-off'], 'x' => 54, 'y' => 57],
            ['name' => 'City of Delavan', 'county' => 'Walworth County', 'types' => ['Residential', 'Commercial', 'Roll-off'], 'x' => 58, 'y' => 54],
            ['name' => 'Town of Darien', 'county' => 'Walworth County', 'types' => ['Residential', 'Commercial', 'Roll-off'], 'x' => 38, 'y' => 42],
            ['name' => 'Town of Sharon', 'county' => 'Walworth County', 'types' => ['Residential', 'Commercial', 'Roll-off'], 'x' => 46, 'y' => 70],
            ['name' => 'Rock County', 'county' => 'Rock County', 'types' => ['Commercial', 'Roll-off'], 'x' => 26, 'y' => 63],
            ['name' => 'Jefferson County', 'county' => 'Jefferson County', 'types' => ['Commercial', 'Roll-off'], 'x' => 56, 'y' => 26],
            ['name' => 'Waukesha County', 'county' => 'Waukesha County', 'types' => ['Commercial', 'Roll-off'], 'x' => 76, 'y' => 24],
            ['name' => 'Kenosha County', 'county' => 'Kenosha County', 'types' => ['Commercial', 'Roll-off'], 'x' => 82, 'y' => 72],
        ],
        'notices' => [
            ['title' => 'Service alerts and updates', 'type' => 'Announcement', 'date' => '2026-08-10', 'body' => 'No urgent service alerts are active. Weather delays, holiday schedule changes, closures, and route updates will be posted here.'],
        ],
    ];

    return $data;
}

function ndses_community_seed(string $name, string $type, string $day, string $trash, string $recycle, string $cans, string $mission, array $accepted, array $not, array $never, array $bulk_accepted, array $bulk_not): array
{
    return [
        'name' => $name,
        'type' => $type,
        'service_day' => $day,
        'trash_schedule' => $trash,
        'recycling_schedule' => $recycle,
        'description' => $mission,
        'guidelines' => ['Trash is collected weekly.', 'Residents are required to provide their own trash cans, not exceeding 60 pounds.', $cans, 'Please bag all trash and place it at roadside no later than 5:30am.'],
        'accepted_recycling' => $accepted,
        'recycling_not_accepted' => $not,
        'recycling_never_accepted' => $never,
        'bulk_accepted' => $bulk_accepted,
        'bulk_not_accepted' => $bulk_not,
        'bulk_policy' => 'This is not an inclusive list. Please contact us to schedule a bulk pickup. Electronics and certain items can be collected by contacting our office; a fee may apply.',
    ];
}

function ndses_faq_seed(): array
{
    return [
        'Dumpster Rentals' => [
            ['How do I choose the right dumpster size?', 'The best dumpster size depends on your project. Smaller dumpsters are great for garage cleanouts and minor renovations, while larger dumpsters are ideal for construction, demolition, and whole-home cleanouts. If you are unsure, our team is happy to help you choose the right size.'],
            ['How long can I keep the dumpster?', 'The rental period is 15 days. If you need accommodations to this, please let us know and we will work with you.'],
            ['Do I need to be home for delivery?', 'No. As long as you have provided clear placement instructions and the delivery area is accessible, you do not need to be present.'],
            ['How full can I load the dumpster?', 'Materials should never extend above the top edge of the dumpster. Overfilled dumpsters may require materials to be removed before pickup for safety reasons.'],
            ['How soon can my dumpster be delivered?', 'We strive to provide prompt service and can often deliver within one to two business days, depending on availability and your location. Contact us for current scheduling.'],
            ['How much does a dumpster rental cost?', 'Pricing depends on several factors, including dumpster size, rental length, location, and the type of debris being disposed of. Contact us for a free, no-obligation quote.'],
            ['What happens when I am finished with the dumpster?', 'Simply call us when you are ready, or schedule your pickup in advance. We will come collect the dumpster and properly dispose of the contents.'],
        ],
        'Residential Trash & Recycling' => [
            ['When is my trash and recycling pickup?', 'Town of Delavan: Monday. Town of Sharon/Darien: Tuesday. City of Delavan: Wednesday. Town of Walworth: Thursday.'],
            ['What time should I place my bins at the curb?', 'Please have your cart at the curb by 5:30 a.m. on your scheduled collection day.'],
            ['What can I put in my trash can?', 'Household waste such as food waste, packaging, paper products, clothing, and non-hazardous household items.'],
            ['What can I recycle?', 'Recycling items include cardboard, paper, aluminum, steel cans, plastic bottles and jugs, and glass bottles and jars.'],
            ['Do I need to bag my recyclables?', 'Yes, please place all recyclables in clear plastic recyclable bags.'],
            ['Do you offer bulk item pickups?', 'Yes. If you are a current residential customer, you get two free bulk item pickups per month for items such as furniture or mattresses. Contact us ahead for scheduling and guidelines.'],
            ['What happens if a holiday falls on my pickup day?', 'Please refer to our service calendar to see holidays that will result in a one-day delay in service.'],
            ['Does NDS supply the cans or do I?', 'NDS Environmental Solutions does not supply residential garbage cans. You may have up to three 32-gallon bins for both trash and recycle or one 96-gallon can for each. Anything beyond this will be considered extra and is subject to additional fees.'],
        ],
        'Commercial Trash & Recycling' => [
            ['What size dumpsters do you offer?', 'We offer 96-gallon containers, 2-yard dumpsters, 4-yard dumpsters, 6-yard dumpsters, and 8-yard dumpsters. Our team can help determine the best size for your business.'],
            ['How often can my dumpster be serviced?', 'We offer flexible schedules ranging from once per week to multiple collections per week depending on your needs.'],
            ['Can I change my dumpster size or frequency?', 'Absolutely. As your business grows or your needs change, we can adjust your container size or collection schedule. Give us a call at 262-233-6131 to arrange any changes.'],
            ['Do you offer temporary dumpsters for businesses?', 'Yes. In addition to regular commercial service, we offer temporary roll-off dumpsters for construction projects, renovations, office cleanouts, and special events.'],
            ['What happens if my dumpster is overflowing?', 'If your dumpster is consistently full before pickup, contact us about increasing your service frequency or upgrading to a larger container.'],
            ['How do I request service or get a quote?', 'Call us at 262-233-6131 or fill out our online quote request form. We will help you choose the right service and provide a customized quote.'],
        ],
    ];
}

