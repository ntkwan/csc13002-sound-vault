import { PageTitle } from '@components/index';
import { sections } from '@components';

function TermAndPolicyPage() {
    return (
        <div>
            <PageTitle title="Terms & Policy" className="text-[170px]" />
            <p className="font-kodchasan text-[25px] font-bold">
                AGREEMENT ON THE EXCHANGE AND PROVISION OF INFORMATION ON THE
                SOUNDVAULT WEBSITE
            </p>
            <div className="h-[calc(100%-200px)] overflow-y-auto px-3">
                {sections.map((section, index) => (
                    <div key={index} className="my-4">
                        <h2 className="flex text-2xl font-bold">
                            <span className="mr-2">{section.title}</span>
                        </h2>
                        <div className="mx-2 mt-3">{section.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TermAndPolicyPage;
