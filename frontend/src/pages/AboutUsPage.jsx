import { PageTitle } from '@components/index';
import { toast } from 'react-toastify';
import { useContractToSupportMutation } from '@services/api';

function AboutUsPage() {
    const [contractToSupport] = useContractToSupportMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const content = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phoneNumber: formData.get('phone'),
            message: formData.get('message'),
        };

        try {
            await contractToSupport(content).unwrap();
            toast.success('Message sent successfully');
            e.target.reset();
        } catch (error) {
            toast.error('Error sending message');
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="about-us-page pt-8">
            <PageTitle title="Contact Us" />
            <div className="space-y-20">
                <section className="aup__intro space-y-6">
                    <h2 className="aup__intro-title inline text-3xl font-bold">
                        Our product
                    </h2>
                    <p className="aup__intro-content">
                        <strong className="pr-2 font-lilitaone text-2xl font-medium">
                            SoundVault
                        </strong>
                        is a digital music service that gives users access to
                        millions of songs. The platform aims tobe a
                        decentralized application that applies blockchain to
                        music&rsquo;s reservation of rights for
                        supportingindependent artists uploading their music on
                        the platform with copyrights.
                    </p>
                </section>

                <section className="w-full space-y-6">
                    <h2 className="inline text-3xl font-bold">Contact Us</h2>
                    <p className="text-xl text-[#a5a5a5]">
                        We&rsquo;d love to hear from you. Please fill out this
                        form.
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="m-auto grid w-2/3 auto-rows-auto grid-cols-2 gap-10 rounded-xl border p-12"
                    >
                        <label
                            htmlFor="firstName"
                            className="block text-xl italic"
                        >
                            <span className="block">First Name</span>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none"
                                required
                            />
                        </label>

                        <label
                            htmlFor="lastName"
                            className="block text-xl italic"
                        >
                            <span className="block">Last Name</span>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none"
                                required
                            />
                        </label>

                        <label htmlFor="email" className="block text-xl italic">
                            <span className="block">Email</span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none"
                                required
                            />
                        </label>

                        <label htmlFor="phone" className="block text-xl italic">
                            <span className="block">Phone Number</span>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none"
                                title="Phone number must be 10 or 11 digits, consisting only of numbers."
                                pattern="[0-9]{10,11}"
                                required
                            />
                        </label>

                        <label
                            htmlFor="message"
                            className="col-span-2 block flex-col text-xl italic"
                        >
                            <span className="block">Message</span>
                            <textarea
                                id="message"
                                name="message"
                                className="w-full border-b bg-transparent focus-visible:outline-none"
                                rows="3"
                                required
                            ></textarea>
                        </label>

                        <button
                            type="submit"
                            className="button group relative col-span-2 m-auto rounded-full border-2 px-6 py-3"
                        >
                            Send Message
                            <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100 group-disabled:opacity-0"></div>
                        </button>
                    </form>
                </section>

                <section className="space-y-6">
                    <h2 className="inline text-3xl font-bold">
                        Our contact details
                    </h2>
                    <div className="flex items-center space-x-4">
                        <i className="bx bxs-envelope pl-4 text-3xl"></i>
                        <p>soundvault.co@gmail.com</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutUsPage;
