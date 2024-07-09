import { PageTitle } from '@components/index';

function AboutUsPage() {
    return (
        <div className="about-us-page pt-8">
            <PageTitle title="About Us" />
            <div className="space-y-20">
                <section className="aup__intro space-y-6">
                    <h2 className="aup__intro-title inline text-3xl font-bold">
                        Our product
                    </h2>
                    <p className="aup__intro-content">
                        <span className="pr-2 font-lilitaone text-2xl">
                            SoundVault
                        </span>
                        <span className="text-xl">
                            is a digital music service that gives users access
                            to millions of songs. The platform aims tobe a
                            decentralized application that applies blockchain to
                            music&rsquo;s reservation of rights for
                            supportingindependent artists uploading their music
                            on the platform with copyrights.
                        </span>
                    </p>
                </section>

                <section className="w-full space-y-6">
                    <h2 className="inline text-3xl font-bold">Contact Us</h2>
                    <p className="text-xl text-[#a5a5a5]">
                        We&rsquo;d love to hear from you. Please fill out this
                        form.
                    </p>
                    <form className="m-auto grid w-2/3 auto-rows-auto grid-cols-2 gap-10 rounded-xl border p-12">
                        <div className="">
                            <label
                                htmlFor="name"
                                className="block text-xl italic"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none"
                            />
                        </div>

                        <div className="">
                            <label
                                htmlFor="name"
                                className="block text-xl italic"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none"
                            />
                        </div>

                        <div className="">
                            <label
                                htmlFor="name"
                                className="block text-xl italic"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none"
                            />
                        </div>

                        <div className="">
                            <label
                                htmlFor="name"
                                className="block text-xl italic"
                            >
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                className="input w-5/6 border-b bg-transparent focus-visible:outline-none"
                            />
                        </div>

                        <div className="col-span-2 flex-col">
                            <label
                                htmlFor="message"
                                className="block text-xl italic"
                            >
                                Message
                            </label>
                            <textarea
                                id="message"
                                className="w-full border-b bg-transparent focus-visible:outline-none"
                                rows="3"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="button col-span-2 m-auto rounded-full border px-6 py-3"
                        >
                            Send Message
                        </button>
                    </form>
                </section>

                <section className="space-y-6">
                    <h2 className="inline text-3xl font-bold">
                        Our contact details
                    </h2>
                    <div className="flex items-center space-x-4">
                        <i className="bx bxs-envelope pl-4 text-3xl"></i>
                        <p className="text-xl">soundvault.co@gmail.com</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AboutUsPage;
