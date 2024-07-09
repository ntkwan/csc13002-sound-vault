import { PageTitle } from "@components/index";

function AboutUsPage() {
    return (
        <div className="about-us-page pt-8">
            <PageTitle title="About Us" />
            <div className="space-y-20">

                <section className="aup__intro space-y-6">
                    <h2 className="aup__intro-title inline font-bold text-3xl">Our product</h2>
                    <p className="aup__intro-content">
                        <span className="font-lilitaone text-2xl pr-2">SoundVault</span>
                        <span className="text-xl">
                            is a digital music service that gives users access to millions of songs.
                            The platform aims tobe a decentralized application that applies blockchain to music's
                            reservation of rights for supportingindependent artists uploading their music on the platform
                            with copyrights.
                        </span>
                    </p>
                </section>

                <section className="w-full space-y-6">
                    <h2 className="inline font-bold text-3xl">Contact Us</h2>
                    <p className="text-xl text-[#a5a5a5]">
                        We'd love to hear from you. Please fill out this form.
                    </p>
                    <form className="grid grid-cols-2 auto-rows-auto gap-10 w-2/3 p-12 m-auto border rounded-xl">
                        <div className="">
                            <label htmlFor="name" className="block italic text-xl">First Name</label>
                            <input
                                type="text"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none "
                            />
                        </div>

                        <div className="">
                            <label htmlFor="name" className="block italic text-xl">Last Name</label>
                            <input
                                type="text"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none "
                            />
                        </div>

                        <div className="">
                            <label htmlFor="name" className="block italic text-xl">Email</label>
                            <input
                                type="email"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none "
                            />
                        </div>

                        <div className="">
                            <label htmlFor="name" className="block italic text-xl">Phone Number</label>
                            <input
                                type="tel"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none "
                            />
                        </div>

                        <div class="col-span-2 flex-col">
                            <label for="message" class="block italic text-xl">Message</label>
                            <textarea
                                id="message"
                                className="w-full bg-transparent border-b focus-visible:outline-none"
                                rows="3"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="button col-span-2 m-auto border rounded-full px-6 py-3"
                        >
                            Send Message
                        </button>
                    </form>
                </section>

                <section className="space-y-6">
                    <h2 className="inline font-bold text-3xl">Our contact details</h2>
                    <div className="flex items-center space-x-4">
                        <i className="bx bxs-envelope text-3xl pl-4" ></i>
                        <p className="text-xl">soundvault.co@gmail.com</p>
                    </div>
                </section>
            </div>

        </div>
    );
};


export default AboutUsPage;